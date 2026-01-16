import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { syncUserToDatabase } from '@/lib/utils/syncUser';
import type { CreateSessionRequest } from '@/types/api';

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
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const user = await getOrCreateUser(authUser);

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    const where = {
      userId: user.id,
      ...(status && { status: status as 'ACTIVE' | 'COMPLETED' | 'ABANDONED' }),
    };

    const [sessions, total] = await Promise.all([
      prisma.studySession.findMany({
        where,
        orderBy: { startTime: 'desc' },
        take: limit,
        skip: offset,
        include: {
          category: {
            select: { id: true, name: true, color: true },
          },
        },
      }),
      prisma.studySession.count({ where }),
    ]);

    return NextResponse.json({
      sessions,
      total,
      hasMore: offset + sessions.length < total,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create new session
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body: CreateSessionRequest = await request.json();
    const { categoryId, sessionType } = body;

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
      TEST_HAND: 1, // 10 seconds, stored as 1 minute for DB
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

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
