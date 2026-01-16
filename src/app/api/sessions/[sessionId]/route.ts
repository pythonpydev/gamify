import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { calculateChips } from '@/lib/utils/chips';

// GET /api/sessions/[sessionId] - Get session details
export async function GET(
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

    const session = await prisma.studySession.findFirst({
      where: {
        id: sessionId,
        user: { authId: authUser.id },
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: { message: 'Session not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// PATCH /api/sessions/[sessionId] - Complete or abandon a session
export async function PATCH(
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
    const body = await request.json();
    const { status, qualityRating, notes } = body;

    // Find the session
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

    let chipsEarned = 0;

    if (status === 'COMPLETED' && qualityRating) {
      // Calculate chips - check if it's a test session
      const isTestSession = session.sessionType === 'TEST_HAND';
      const chipResult = calculateChips(session.durationMins, qualityRating, isTestSession);
      chipsEarned = chipResult.totalChips;
    }

    // Update the session
    const updatedSession = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        status,
        endTime: new Date(),
        qualityRating: qualityRating || null,
        notes: notes || null,
        chipsEarned,
      },
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
      },
    });

    // Update user's chips if session was completed
    if (status === 'COMPLETED' && chipsEarned > 0) {
      await prisma.user.update({
        where: { authId: authUser.id },
        data: {
          currentChips: { increment: chipsEarned },
          totalChipsEarned: { increment: chipsEarned },
        },
      });
    }

    return NextResponse.json({
      session: updatedSession,
      chipsEarned,
    });
  } catch (error) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
