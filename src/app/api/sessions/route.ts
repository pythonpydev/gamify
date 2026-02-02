import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { syncUserToDatabase } from '@/lib/utils/syncUser';
import type { CreateSessionRequest } from '@/types/api';
import { validateSessionType, validatePagination } from '@/lib/utils/validation';
import { checkRateLimit, getRateLimitIdentifier, getRateLimitHeaders, RATE_LIMITS } from '@/lib/utils/rateLimit';
import { logRequest, getRequestMetadata } from '@/lib/utils/apiLogger';

// Helper to get or create user in database
async function getOrCreateUser(authUser: { id: string; email?: string }) {
  let user = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });

  if (!user) {
    // Sync user from Supabase Auth
    user = await syncUserToDatabase(authUser as Parameters<typeof syncUserToDatabase>[0]);
  }

  return user;
}

// GET /api/sessions - List user's sessions
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(request);
  
  try {
    // Rate limiting
    const rateLimitId = getRateLimitIdentifier(request, 'sessions:read');
    const rateLimit = checkRateLimit(rateLimitId, RATE_LIMITS.API_READ);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: { message: 'Too many requests' } },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }
    
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      logRequest({ ...metadata, statusCode: 401, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const user = await getOrCreateUser(authUser);

    const { searchParams } = new URL(request.url);
    const pagination = validatePagination(
      searchParams.get('limit') || undefined,
      searchParams.get('offset') || undefined
    );
    const status = searchParams.get('status');

    const where = {
      userId: user.id,
      ...(status && { status: status as 'ACTIVE' | 'COMPLETED' | 'ABANDONED' }),
    };

    const [sessions, total] = await Promise.all([
      prisma.studySession.findMany({
        where,
        orderBy: { startTime: 'desc' },
        take: pagination.limit,
        skip: pagination.offset,
        include: {
          category: {
            select: { id: true, name: true, color: true },
          },
        },
      }),
      prisma.studySession.count({ where }),
    ]);

    logRequest({ 
      ...metadata, 
      userId: authUser.id, 
      statusCode: 200, 
      duration: Date.now() - startTime 
    });

    return NextResponse.json(
      {
        sessions,
        total,
        hasMore: pagination.offset + sessions.length < total,
      },
      { headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    logRequest({ 
      ...metadata, 
      statusCode: 500, 
      duration: Date.now() - startTime,
      error: message 
    });
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new session
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const metadata = getRequestMetadata(request);
  
  try {
    // Rate limiting
    const rateLimitId = getRateLimitIdentifier(request, 'sessions:create');
    const rateLimit = checkRateLimit(rateLimitId, RATE_LIMITS.API_WRITE);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: { message: 'Too many requests' } },
        { status: 429, headers: getRateLimitHeaders(rateLimit) }
      );
    }
    
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      logRequest({ ...metadata, statusCode: 401, duration: Date.now() - startTime });
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    const body: CreateSessionRequest = await request.json();
    const { categoryId, sessionType } = body;
    
    // Validate session type
    const typeValidation = validateSessionType(sessionType);
    if (!typeValidation.valid) {
      logRequest({ 
        ...metadata, 
        userId: authUser.id, 
        statusCode: 400, 
        duration: Date.now() - startTime,
        error: typeValidation.error 
      });
      return NextResponse.json(
        { error: { message: typeValidation.error } },
        { status: 400, headers: getRateLimitHeaders(rateLimit) }
      );
    }

    // Get or create the user in our database
    const user = await getOrCreateUser(authUser);

    // Check for existing active session
    const activeSession = await prisma.studySession.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
    });

    if (activeSession) {
      return NextResponse.json(
        { error: { message: 'User already has an active session' } },
        { status: 400 }
      );
    }

    // Validate category exists
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId: user.id }, { isDefault: true }],
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: { message: 'Category not found' } },
        { status: 404 }
      );
    }

    // Get duration from session type
    const durations: Record<string, number> = {
      QUICK_HAND: 15,
      STANDARD: 25,
      DEEP_STACK: 50,
    };
    const durationMins = durations[sessionType] || 25;

    // Create the session
    const session = await prisma.studySession.create({
      data: {
        userId: user.id,
        categoryId,
        sessionType,
        durationMins,
        startTime: new Date(),
        status: 'ACTIVE',
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    logRequest({ 
      ...metadata, 
      userId: authUser.id, 
      statusCode: 201, 
      duration: Date.now() - startTime 
    });

    return NextResponse.json(
      session,
      { status: 201, headers: getRateLimitHeaders(rateLimit) }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    logRequest({ 
      ...metadata, 
      statusCode: 500, 
      duration: Date.now() - startTime,
      error: message 
    });
    return NextResponse.json(
      { error: { message, details: String(error) } },
      { status: 500 }
    );
  }
}
