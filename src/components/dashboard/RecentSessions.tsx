'use client';

import { cn } from '@/lib/utils/cn';
import { SessionCard, type SessionDisplay } from './SessionCard';

export interface RecentSessionsProps {
  sessions: SessionDisplay[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function RecentSessions({
  sessions,
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  className,
}: RecentSessionsProps) {
  const displayedSessions = sessions.slice(0, maxItems);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Sessions</h2>
        {showViewAll && sessions.length > 0 && (
          <button
            onClick={onViewAll}
            className="text-sm text-poker-gold hover:text-poker-gold/80 transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      {displayedSessions.length === 0 ? (
        <div className="text-center py-12 bg-neutral-900/50 rounded-lg border border-neutral-800">
          <div className="text-4xl mb-3">🃏</div>
          <p className="text-neutral-400 mb-2">No sessions yet</p>
          <p className="text-sm text-neutral-500">
            Start your first study session to earn chips!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedSessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
