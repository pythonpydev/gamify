'use client';

import { useState } from 'react';
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
  onDelete?: (sessionId: string) => void;
}

const sessionTypeLabels: Record<string, string> = {
  QUICK_HAND: 'Quick Hand',
  STANDARD: 'Standard',
  DEEP_STACK: 'Deep Stack',
  TEST_HAND: 'Test Hand',
};

const sessionTypeEmoji: Record<string, string> = {
  QUICK_HAND: '⚡',
  STANDARD: '🃏',
  DEEP_STACK: '♠️',
  TEST_HAND: '🧪',
};

export function SessionCard({ session, className, onDelete }: SessionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const formattedDate = new Date(session.completedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const isAbandoned = session.status === 'ABANDONED';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session? This will also remove the chips earned.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch(`/api/sessions/${session.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to delete session');
      }

      onDelete?.(session.id);
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete session. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={cn(
        'flex items-center justify-between p-4',
        isAbandoned && 'opacity-60',
        isDeleting && 'opacity-50 pointer-events-none',
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

      {/* Chips earned and delete button */}
      <div className="flex items-center gap-4">
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

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            title="Delete session"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </Card>
  );
}
