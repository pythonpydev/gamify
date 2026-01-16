import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db/prisma';
import { syncUserToDatabase } from '@/lib/utils/syncUser';

/**
 * GET /api/users/me/stats
 *
 * Returns the current user's stats including:
 * - Total chips
 * - Total sessions completed
 * - Total study time
 * - Sessions by category
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { authId: authUser.id },
      select: {
        id: true,
        currentChips: true,
        totalChipsEarned: true,
      },
    });

    // If user doesn't exist in database, sync them from Supabase Auth
    if (!user) {
      try {
        const syncedUser = await syncUserToDatabase(authUser);
        user = {
          id: syncedUser.id,
          currentChips: syncedUser.currentChips,
          totalChipsEarned: syncedUser.totalChipsEarned,
        };
      } catch (syncError) {
        console.error('Failed to sync user to database:', syncError);
        return NextResponse.json(
          { error: 'Failed to create user in database' },
          { status: 500 }
        );
      }
    }

    // Get session statistics
    const sessionStats = await prisma.studySession.aggregate({
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
      _count: {
        id: true,
      },
      _sum: {
        durationMins: true,
        chipsEarned: true,
      },
      _avg: {
        qualityRating: true,
      },
    });

    // Get sessions by category
    const sessionsByCategory = await prisma.studySession.groupBy({
      by: ['categoryId'],
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
      _count: {
        id: true,
      },
      _sum: {
        durationMins: true,
        chipsEarned: true,
      },
    });

    // Get category details
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        color: true,
      },
    });

    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const categoryStats = sessionsByCategory.map(stat => ({
      categoryId: stat.categoryId,
      categoryName: categoryMap.get(stat.categoryId)?.name || 'Unknown',
      categoryColor: categoryMap.get(stat.categoryId)?.color || '#6366f1',
      sessionCount: stat._count.id,
      totalMinutes: stat._sum.durationMins || 0,
      chipsEarned: stat._sum.chipsEarned || 0,
    }));

    // Get sessions by type
    const sessionsByType = await prisma.studySession.groupBy({
      by: ['sessionType'],
      where: {
        userId: user.id,
        status: 'COMPLETED',
      },
      _count: {
        id: true,
      },
    });

    const typeStats = sessionsByType.reduce((acc, stat) => {
      acc[stat.sessionType] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Get today's sessions for streak calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = await prisma.studySession.count({
      where: {
        userId: user.id,
        status: 'COMPLETED',
        endTime: {
          gte: today,
        },
      },
    });

    const stats = {
      currentChips: user.currentChips,
      totalChipsEarned: user.totalChipsEarned,
      totalSessions: sessionStats._count.id,
      totalMinutes: sessionStats._sum.durationMins || 0,
      averageQuality: sessionStats._avg.qualityRating || 0,
      todaySessions,
      categoryStats,
      typeStats: {
        QUICK_HAND: typeStats.QUICK_HAND || 0,
        STANDARD: typeStats.STANDARD || 0,
        DEEP_STACK: typeStats.DEEP_STACK || 0,
      },
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}
