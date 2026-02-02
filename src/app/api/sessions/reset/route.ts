import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma, withRetry } from '@/lib/db/prisma';

/**
 * DELETE /api/sessions/reset
 * Deletes all sessions for the authenticated user and resets their chips to 0
 */
export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Get user from database
    const dbUser = await withRetry(() =>
      prisma.user.findUnique({
        where: { authId: user.id },
      })
    );

    if (!dbUser) {
      return NextResponse.json(
        { error: { message: 'User not found' } },
        { status: 404 }
      );
    }

    // Delete all sessions and reset chips in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Count and delete all sessions
      const deletedCount = await tx.studySession.deleteMany({
        where: { userId: dbUser.id },
      });

      // Reset user's chips to 0
      await tx.user.update({
        where: { id: dbUser.id },
        data: {
          totalChipsEarned: 0,
          currentChips: 0,
        },
      });

      return deletedCount;
    });

    return NextResponse.json({
      success: true,
      message: 'All sessions deleted successfully',
      sessionsDeleted: result.count,
    });
  } catch (error) {
    console.error('Failed to reset sessions:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
