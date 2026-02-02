'use client';

import { cn } from '@/lib/utils/cn';
import { getRank, getNextRank, getProgressToNextRank } from '@/lib/utils/rank';

export interface RankBadgeProps {
  totalChips: number;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RankBadge({
  totalChips,
  showProgress = true,
  size = 'md',
  className,
}: RankBadgeProps) {
  const currentRank = getRank(totalChips);
  const nextRank = getNextRank(totalChips);
  const progress = getProgressToNextRank(totalChips);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('space-y-2', className)} data-testid="rank-badge">
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-lg font-semibold',
          'bg-neutral-900 border border-neutral-700',
          sizeClasses[size]
        )}
        style={{ borderColor: currentRank.color }}
      >
        <span className={iconSizeClasses[size]}>{currentRank.emoji}</span>
        <span style={{ color: currentRank.color }}>{currentRank.name}</span>
      </div>

      {showProgress && nextRank && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Progress to {nextRank.name}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: nextRank.color,
              }}
            />
          </div>
          <div className="text-xs text-neutral-500 text-right">
            {(nextRank.minChips - totalChips).toLocaleString()} chips to go
          </div>
        </div>
      )}

      {showProgress && !nextRank && (
        <div className="text-xs text-poker-gold text-center">
          🏆 Maximum rank achieved! You are the GOAT!
        </div>
      )}
    </div>
  );
}
