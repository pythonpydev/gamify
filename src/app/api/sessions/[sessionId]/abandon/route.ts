import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

// POST /api/sessions/[sessionId]/abandon - Abandon a session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const { sessionId } = await params;

    // Get the session
    const session = await prisma.studySession.findFirst({
      where: {
        id: sessionId,
        user: { authId: authUser.id },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: { message: 'Session not found' } },
        { status: 404 }
      );
    }

    if (session.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: { message: 'Session is not active' } },
        { status: 400 }
      );
    }

    // Update session to abandoned
    const updatedSession = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        status: 'ABANDONED',
        endTime: new Date(),
        chipsEarned: 0,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Error abandoning session:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
