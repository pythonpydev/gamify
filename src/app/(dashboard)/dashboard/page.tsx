'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChipCounter, RankBadge, RecentSessions, type SessionDisplay } from '@/components/dashboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/lib/store/authStore';

interface SessionApiResponse {
  id: string;
  sessionType: 'QUICK_HAND' | 'STANDARD' | 'DEEP_STACK';
  durationMins: number;
  chipsEarned: number;
  qualityRating: number | null;
  status: 'COMPLETED' | 'ABANDONED';
  endTime: string | null;
  startTime: string;
  category?: {
    name: string;
    color: string;
  };
}

interface DashboardStats {
  currentChips: number;
  totalChipsEarned: number;
  totalSessions: number;
  totalMinutes: number;
  averageQuality: number;
  todaySessions: number;
  categoryStats: Array<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    sessionCount: number;
    totalMinutes: number;
    chipsEarned: number;
  }>;
  typeStats: {
    QUICK_HAND: number;
    STANDARD: number;
    DEEP_STACK: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading: authLoading, initialize } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<SessionDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch stats and sessions in parallel
        const [statsRes, sessionsRes] = await Promise.all([
          fetch('/api/users/me/stats', { credentials: 'include' }),
          fetch('/api/sessions?limit=5', { credentials: 'include' }),
        ]);

        if (!statsRes.ok || !sessionsRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [statsData, sessionsData] = await Promise.all([
          statsRes.json(),
          sessionsRes.json(),
        ]);

        setStats(statsData.stats);

        // Transform sessions for display
        const displaySessions: SessionDisplay[] = (sessionsData.sessions as SessionApiResponse[]).map((s) => ({
          id: s.id,
          sessionType: s.sessionType,
          categoryName: s.category?.name || 'Unknown',
          categoryColor: s.category?.color || '#6366f1',
          durationMinutes: s.durationMins,
          chipsEarned: s.chipsEarned,
          qualityRating: s.qualityRating,
          status: s.status,
          completedAt: s.endTime || s.startTime,
        }));

        setSessions(displaySessions);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-poker-felt-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🎰</div>
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-poker-felt-dark flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  const totalHours = stats ? Math.floor(stats.totalMinutes / 60) : 0;
  const remainingMinutes = stats ? stats.totalMinutes % 60 : 0;

  return (
    <div className="min-h-screen bg-poker-felt-dark">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎰</span>
              <span className="text-xl font-bold text-white">Study Poker</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-poker-gold font-medium">
                Dashboard
              </Link>
              <Link href="/session" className="text-neutral-300 hover:text-white transition-colors">
                Timer
              </Link>
              <Link href="/history" className="text-neutral-300 hover:text-white transition-colors">
                History
              </Link>
              <Link href="/categories" className="text-neutral-300 hover:text-white transition-colors">
                Categories
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-neutral-400">
            Ready for another productive study session?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Chips & Rank Card */}
          <Card className="p-6 md:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-medium text-neutral-400 mb-2">Your Progress</h2>
                <ChipCounter chips={stats?.totalChipsEarned || 0} size="lg" />
              </div>
              <RankBadge totalChips={stats?.totalChipsEarned || 0} />
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card className="p-6">
            <h2 className="text-sm font-medium text-neutral-400 mb-4">Study Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Total Sessions</span>
                <span className="text-white font-semibold">{stats?.totalSessions || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Total Time</span>
                <span className="text-white font-semibold">
                  {totalHours}h {remainingMinutes}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Today</span>
                <span className="text-white font-semibold">{stats?.todaySessions || 0} sessions</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Avg. Quality</span>
                <span className="text-white font-semibold">
                  {stats?.averageQuality ? stats.averageQuality.toFixed(1) : '-'}/5
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mb-8">
          <Link href="/session">
            <Button variant="primary" size="lg">
              Start New Session
            </Button>
          </Link>
          <Link href="/history">
            <Button variant="secondary" size="lg">
              View History
            </Button>
          </Link>
        </div>

        {/* Recent Sessions */}
        <RecentSessions
          sessions={sessions}
          maxItems={5}
          onViewAll={() => router.push('/history')}
        />
      </main>
    </div>
  );
}
