import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma, withRetry } from '@/lib/db/prisma';
import { syncUserToDatabase } from '@/lib/utils/syncUser';

/**
 * GET /api/categories
 *
 * Returns all categories for the authenticated user
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error in categories API:', authError);
      return NextResponse.json(
        { error: 'Authentication error', details: authError.message },
        { status: 401 }
      );
    }

    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated - please log in' },
        { status: 401 }
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

    return NextResponse.json({ categories: formattedCategories });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch categories';
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
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await withRetry(() => prisma.user.findUnique({
      where: { authId: authUser.id },
      select: { id: true },
    }));

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, color } = body;

    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    if (name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Category name cannot be empty' },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: 'Category name must be 50 characters or less' },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const existing = await withRetry(() => prisma.category.findFirst({
      where: {
        userId: user.id,
        name: { equals: name.trim(), mode: 'insensitive' },
      },
    }));

    if (existing) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 400 }
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

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json(
      { error: 'Failed to create category', details: message },
      { status: 500 }
    );
  }
}
