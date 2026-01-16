import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { calculateChips } from '@/lib/utils/chips';
import { getRankName } from '@/lib/utils/rank';
import type { CompleteSessionRequest, CompleteSessionResponse } from '@/types/api';

// POST /api/sessions/[sessionId]/complete - Complete a session
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
    const body: CompleteSessionRequest = await request.json();
    const { qualityRating, notes } = body;

    // Validate quality rating
    if (!qualityRating || qualityRating < 1 || qualityRating > 5) {
      return NextResponse.json(
        { error: { message: 'Quality rating must be between 1 and 5' } },
        { status: 400 }
      );
    }

    // Get the session
    const session = await prisma.studySession.findFirst({
      where: {
        id: sessionId,
        user: { authId: authUser.id },
      },
      include: {
        user: true,
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

    // Calculate chips earned
    const endTime = new Date();
    const actualDurationMins = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
    );
    const chipResult = calculateChips(actualDurationMins, qualityRating);

    // Update session and user in a transaction
    const [updatedSession, updatedUser] = await prisma.$transaction([
      prisma.studySession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          endTime,
          durationMins: actualDurationMins,
          qualityRating,
          chipsEarned: chipResult.totalChips,
          notes: notes || null,
        },
      }),
      prisma.user.update({
        where: { id: session.userId },
        data: {
          currentChips: { increment: chipResult.totalChips },
          totalChipsEarned: { increment: chipResult.totalChips },
        },
      }),
    ]);

    const response: CompleteSessionResponse = {
      session: {
        id: updatedSession.id,
        chipsEarned: updatedSession.chipsEarned,
        status: 'COMPLETED',
      },
      chipsEarned: chipResult.totalChips,
      totalChips: updatedUser.currentChips,
      newRank: getRankName(updatedUser.totalChipsEarned),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
