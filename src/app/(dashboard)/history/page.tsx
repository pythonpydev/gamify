'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { SessionCard, type SessionDisplay } from '@/components/dashboard';
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

interface SessionsResponse {
  sessions: SessionApiResponse[];
  total: number;
  hasMore: boolean;
}

export default function HistoryPage() {
  const { initialize } = useAuthStore();

  const [sessions, setSessions] = useState<SessionDisplay[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const limit = 10;

  useEffect(() => {
    initialize();
  }, [initialize]);

  const fetchSessions = useCallback(async (newOffset: number, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: newOffset.toString(),
      });

      if (statusFilter) {
        params.set('status', statusFilter);
      }

      const res = await fetch(`/api/sessions?${params}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data: SessionsResponse = await res.json();

      const displaySessions: SessionDisplay[] = data.sessions.map((s) => ({
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

      if (append) {
        setSessions((prev) => [...prev, ...displaySessions]);
      } else {
        setSessions(displaySessions);
      }

      setTotal(data.total);
      setHasMore(data.hasMore);
      setOffset(newOffset);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Failed to load session history');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSessions(0);
  }, [fetchSessions]);

  const loadMore = () => {
    fetchSessions(offset + limit, true);
  };

  const handleDeleteSession = (sessionId: string) => {
    // Remove the session from the list
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setTotal((prev) => prev - 1);
  };

  const handleResetAll = async () => {
    if (!confirm('Are you sure you want to delete ALL sessions? This will reset your chips to 0 and cannot be undone!')) {
      return;
    }

    try {
      setIsResetting(true);
      const res = await fetch('/api/sessions/reset', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to reset sessions');
      }

      const data = await res.json();
      
      // Clear the sessions list
      setSessions([]);
      setTotal(0);
      setHasMore(false);
      
      alert(`Successfully deleted ${data.sessionsDeleted} sessions`);
    } catch (err) {
      console.error('Failed to reset sessions:', err);
      alert('Failed to reset sessions. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-poker-felt-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📜</div>
          <p className="text-neutral-400">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Session History</h1>
            <p className="text-neutral-400">
              {total} total sessions
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Filters */}
            <div data-testid="session-filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-poker-gold"
              >
                <option value="">All Sessions</option>
                <option value="COMPLETED">Completed</option>
                <option value="ABANDONED">Abandoned</option>
              </select>
            </div>

            {/* Reset All button */}
            {total > 0 && (
              <Button
                variant="secondary"
                onClick={handleResetAll}
                disabled={isResetting}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30"
              >
                {isResetting ? 'Resetting...' : 'Reset All Sessions'}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Card className="p-8 text-center mb-8">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => fetchSessions(0)}>
              Try Again
            </Button>
          </Card>
        )}

        {sessions.length === 0 && !error ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🃏</div>
            <h2 className="text-xl font-semibold text-white mb-2">No sessions yet</h2>
            <p className="text-neutral-400 mb-6">
              Complete your first study session to see it here!
            </p>
            <Link href="/session">
              <Button variant="primary">Start a Session</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onDelete={handleDeleteSession}
              />
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="secondary"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
