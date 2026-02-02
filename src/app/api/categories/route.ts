import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma, withRetry } from '@/lib/db/prisma';
import { syncUserToDatabase } from '@/lib/utils/syncUser';
import { validateCategoryName, validateColor } from '@/lib/utils/validation';
import { checkRateLimit, getRateLimitIdentifier, getRateLimitHeaders, RATE_LIMITS } from '@/lib/utils/rateLimit';
import { logRequest, getRequestMetadata, logSecurityEvent } from '@/lib/utils/apiLogger';

/**
 * GET /api/categories
 *
 * Returns all categories for the authenticated user
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(request);
  
  try {
    // Rate limiting
    const rateLimitId = getRateLimitIdentifier(request, 'categories:read');
    const rateLimit = checkRateLimit(rateLimitId, RATE_LIMITS.API_READ);
    
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', { endpoint: 'categories:read' }, request);
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }
    
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      logRequest({ ...metadata, statusCode: 401, duration: Date.now() - startTime, error: authError.message });
      return NextResponse.json(
        { error: 'Authentication error', details: authError.message },
        { status: 401, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    if (!authUser) {
      logRequest({ ...metadata, statusCode: 401, duration: Date.now() - startTime, error: 'Not authenticated' });
      return NextResponse.json(
        { error: 'Not authenticated - please log in' },
        { status: 401, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    let user = await withRetry(() => prisma.user.findUnique({
      where: { authId: authUser.id },
      select: { id: true },
    }));

    // If user doesn't exist in database, sync them from Supabase Auth
    if (!user) {
      try {
        const syncedUser = await syncUserToDatabase(authUser);
        user = { id: syncedUser.id };
      } catch (syncError) {
        console.error('Failed to sync user to database:', syncError);
        return NextResponse.json(
          { error: 'Failed to create user in database' },
          { status: 500 }
        );
      }
    }

    // Get categories with session count
    const categories = await withRetry(() => prisma.category.findMany({
      where: { userId: user!.id },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: { sessions: true },
        },
      },
    }));

    const formattedCategories = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      isDefault: cat.isDefault,
      sessionCount: cat._count.sessions,
    }));

    logRequest({ 
      ...metadata, 
      userId: authUser.id, 
      statusCode: 200, 
      duration: Date.now() - startTime 
    });

    return NextResponse.json(
      { categories: formattedCategories },
      { headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
    logRequest({ 
      ...metadata, 
      statusCode: 500, 
      duration: Date.now() - startTime, 
      error: message 
    });
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 *
 * Creates a new category for the authenticated user
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(request);
  
  try {
    // Rate limiting
    const rateLimitId = getRateLimitIdentifier(request, 'categories:create');
    const rateLimit = checkRateLimit(rateLimitId, RATE_LIMITS.API_WRITE);
    
    if (!rateLimit.allowed) {
      logSecurityEvent('rate_limit_exceeded', { endpoint: 'categories:create' }, request);
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimit),
        }
      );
    }
    
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      logRequest({ ...metadata, statusCode: 401, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const user = await withRetry(() => prisma.user.findUnique({
      where: { authId: authUser.id },
      select: { id: true },
    }));

    if (!user) {
      logRequest({ ...metadata, userId: authUser.id, statusCode: 404, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const body = await request.json();
    const { name, color } = body;

    // Validation - using security utilities
    const nameValidation = validateCategoryName(name);
    if (!nameValidation.valid) {
      logRequest({ 
        ...metadata, 
        userId: authUser.id, 
        statusCode: 400, 
        duration: Date.now() - startTime,
        error: nameValidation.error 
      });
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const colorValidation = validateColor(color);
    if (!colorValidation.valid) {
      logRequest({ 
        ...metadata, 
        userId: authUser.id, 
        statusCode: 400, 
        duration: Date.now() - startTime,
        error: colorValidation.error 
      });
      return NextResponse.json(
        { error: colorValidation.error },
        { status: 400, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // Check for duplicate name (already validated above, but keeping for DB safety)
    const existing = await withRetry(() => prisma.category.findFirst({
      where: {
        userId: user.id,
        name: { equals: name.trim(), mode: 'insensitive' },
      },
    }));

    if (existing) {
      logRequest({ 
        ...metadata, 
        userId: authUser.id, 
        statusCode: 400, 
        duration: Date.now() - startTime,
        error: 'Duplicate category' 
      });
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // Create category
    const category = await withRetry(() => prisma.category.create({
      data: {
        userId: user.id,
        name: name.trim(),
        color: color || '#6366f1',
        isDefault: false,
      },
    }));

    logRequest({ 
      ...metadata, 
      userId: authUser.id, 
      statusCode: 201, 
      duration: Date.now() - startTime 
    });

    return NextResponse.json(
      { category }, 
      { status: 201, headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category';
    logRequest({ 
      ...metadata, 
      statusCode: 500, 
      duration: Date.now() - startTime,
      error: message 
    });
    return NextResponse.json(
      { error: 'Failed to create category', details: message },
      { status: 500 }
    );
  }
}
