'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'BREAK_RUNNING' | 'BREAK_PAUSED' | 'BREAK_COMPLETED';
  mode?: 'WORK' | 'BREAK';
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
  mode = 'WORK',
  className,
}: TimerDisplayProps) {
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const isBreak = mode === 'BREAK';

  const getStatusColor = () => {
    if (isBreak) {
      switch (status) {
        case 'BREAK_RUNNING':
          return 'text-blue-600';
        case 'BREAK_PAUSED':
          return 'text-yellow-600';
        case 'BREAK_COMPLETED':
          return 'text-green-600';
        default:
          return 'text-gray-600';
      }
    } else {
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
    }
  };

  const getProgressColor = () => {
    if (isBreak) {
      return status === 'BREAK_COMPLETED' ? 'text-green-500' : 'text-blue-500';
    } else {
      return status === 'COMPLETED' ? 'text-chip-gold' : 'text-felt-500';
    }
  };

  const getStatusText = () => {
    if (isBreak) {
      switch (status) {
        case 'IDLE':
          return 'Ready for Break';
        case 'BREAK_RUNNING':
          return 'On Break';
        case 'BREAK_PAUSED':
          return 'Break Paused';
        case 'BREAK_COMPLETED':
          return 'Break Complete!';
        default:
          return 'Break';
      }
    } else {
      switch (status) {
        case 'IDLE':
          return 'Ready';
        case 'RUNNING':
          return 'Focusing';
        case 'PAUSED':
          return 'Paused';
        case 'COMPLETED':
          return 'Complete!';
        default:
          return 'Ready';
      }
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
              getProgressColor()
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
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Progress bar (mobile alternative) */}
      <div className="w-full max-w-xs mt-4 md:hidden">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-200 rounded-full',
              getProgressColor()
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
