'use client';

import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';

export interface SessionDisplay {
  id: string;
  sessionType: 'QUICK_HAND' | 'STANDARD' | 'DEEP_STACK';
  categoryName: string;
  categoryColor: string;
  durationMinutes: number;
  chipsEarned: number;
  qualityRating: number | null;
  status: 'COMPLETED' | 'ABANDONED';
  completedAt: string;
}

export interface SessionCardProps {
  session: SessionDisplay;
  className?: string;
}

const sessionTypeLabels = {
  QUICK_HAND: 'Quick Hand',
  STANDARD: 'Standard',
  DEEP_STACK: 'Deep Stack',
};

const sessionTypeEmoji = {
  QUICK_HAND: '⚡',
  STANDARD: '🃏',
  DEEP_STACK: '♠️',
};

export function SessionCard({ session, className }: SessionCardProps) {
  const formattedDate = new Date(session.completedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const isAbandoned = session.status === 'ABANDONED';

  return (
    <Card
      className={cn(
        'flex items-center justify-between p-4',
        isAbandoned && 'opacity-60',
        className
      )}
      data-testid="session-card"
    >
      <div className="flex items-center gap-4">
        {/* Session type icon */}
        <div className="text-2xl">
          {sessionTypeEmoji[session.sessionType]}
        </div>

        {/* Session details */}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">
              {sessionTypeLabels[session.sessionType]}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${session.categoryColor}20`, color: session.categoryColor }}
            >
              {session.categoryName}
            </span>
            {isAbandoned && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                Abandoned
              </span>
            )}
          </div>
          <div className="text-sm text-neutral-400 mt-0.5">
            {session.durationMinutes} min • {formattedDate}
          </div>
        </div>
      </div>

      {/* Chips earned */}
      <div className="text-right">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🪙</span>
          <span className={cn(
            'font-bold text-lg tabular-nums',
            isAbandoned ? 'text-neutral-500' : 'text-poker-gold'
          )}>
            {isAbandoned ? 0 : `+${session.chipsEarned}`}
          </span>
        </div>
        {session.qualityRating !== null && !isAbandoned && (
          <div className="text-xs text-neutral-500 mt-0.5">
            Quality: {session.qualityRating}/5
          </div>
        )}
      </div>
    </Card>
  );
}
