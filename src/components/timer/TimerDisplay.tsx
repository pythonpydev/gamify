'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  className?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function TimerDisplay({
  remainingSeconds,
  totalSeconds,
  status,
  className,
}: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  const getStatusColor = () => {
    switch (status) {
      case 'RUNNING':
        return 'text-felt-600';
      case 'PAUSED':
        return 'text-yellow-600';
      case 'COMPLETED':
        return 'text-chip-gold';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={cn('flex flex-col items-center', className)} data-testid="timer-display">
      {/* Circular progress */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            strokeLinecap="round"
            className={cn(
              'transition-all duration-200',
              status === 'COMPLETED' ? 'text-chip-gold' : 'text-felt-500'
            )}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn(
              'font-display text-5xl md:text-6xl font-bold tabular-nums',
              getStatusColor()
            )}
          >
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-sm text-gray-500 mt-2 uppercase tracking-wide">
            {status === 'IDLE' && 'Ready'}
            {status === 'RUNNING' && 'Focusing'}
            {status === 'PAUSED' && 'Paused'}
            {status === 'COMPLETED' && 'Complete!'}
          </span>
        </div>
      </div>

      {/* Progress bar (mobile alternative) */}
      <div className="w-full max-w-xs mt-4 md:hidden">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-200 rounded-full',
              status === 'COMPLETED' ? 'bg-chip-gold' : 'bg-felt-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
