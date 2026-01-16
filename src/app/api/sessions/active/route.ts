import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

// GET /api/sessions/active - Get user's active session
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { authId: authUser.id },
    });

    if (!user) {
      return NextResponse.json(null);
    }

    const activeSession = await prisma.studySession.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json(activeSession);
  } catch (error) {
    console.error('Error fetching active session:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
