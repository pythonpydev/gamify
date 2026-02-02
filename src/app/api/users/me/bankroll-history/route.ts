import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma, withRetry } from '@/lib/db/prisma';

/**
 * GET /api/users/me/bankroll-history
 * Returns daily chip accumulation history for the authenticated user
 */
export async function GET() {
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

    // Get all completed sessions ordered by completion time
    const sessions = await withRetry(() =>
      prisma.studySession.findMany({
        where: {
          userId: dbUser.id,
          status: 'COMPLETED',
          endTime: { not: null },
        },
        orderBy: {
          endTime: 'asc',
        },
        select: {
          endTime: true,
          chipsEarned: true,
        },
      })
    );

    // Calculate cumulative chips by day
    const bankrollHistory: Array<{ date: string; totalChips: number }> = [];
    let cumulativeChips = 0;

    // Group sessions by date and calculate running total
    const dailyChips = new Map<string, number>();
    
    sessions.forEach((session) => {
      if (!session.endTime) return;
      
      const date = new Date(session.endTime).toISOString().split('T')[0]; // YYYY-MM-DD
      const currentDayChips = dailyChips.get(date) || 0;
      dailyChips.set(date, currentDayChips + session.chipsEarned);
    });

    // Convert to array with cumulative totals
    const sortedDates = Array.from(dailyChips.keys()).sort();
    
    sortedDates.forEach((date) => {
      cumulativeChips += dailyChips.get(date) || 0;
      bankrollHistory.push({
        date,
        totalChips: cumulativeChips,
      });
    });

    // If no sessions, return starting point at 0
    if (bankrollHistory.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      bankrollHistory.push({
        date: today,
        totalChips: 0,
      });
    }

    return NextResponse.json({
      history: bankrollHistory,
      currentTotal: dbUser.totalChipsEarned,
    });
  } catch (error) {
    console.error('Error fetching bankroll history:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
