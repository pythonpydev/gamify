'use client';

import { cn } from '@/lib/utils/cn';

export interface ChipCounterProps {
  chips: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

export function ChipCounter({
  chips,
  size = 'md',
  showIcon = true,
  className,
  animated = true,
}: ChipCounterProps) {
  const formattedChips = chips.toLocaleString();

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 font-bold',
        sizeClasses[size],
        className
      )}
      data-testid="chip-count"
    >
      {showIcon && (
        <span className={cn('select-none', iconSizeClasses[size])}>🪙</span>
      )}
      <span
        className={cn(
          'text-poker-gold tabular-nums',
          animated && 'transition-all duration-300'
        )}
      >
        {formattedChips}
      </span>
      <span className="text-neutral-400 font-normal text-sm">chips</span>
    </div>
  );
}
