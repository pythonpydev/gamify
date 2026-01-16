'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { SESSION_TYPES, type SessionTypeName } from '@/types/database';

interface SessionTypeSelectorProps {
  value: SessionTypeName | null;
  onChange: (type: SessionTypeName) => void;
  disabled?: boolean;
  className?: string;
}

const sessionTypeInfo: Record<SessionTypeName, { emoji: string; description: string }> = {
  QUICK_HAND: { emoji: '⚡', description: 'Quick focus burst' },
  STANDARD: { emoji: '🃏', description: 'Classic Pomodoro' },
  DEEP_STACK: { emoji: '🎰', description: 'Deep work session' },
};

export function SessionTypeSelector({
  value,
  onChange,
  disabled = false,
  className,
}: SessionTypeSelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">Session Type</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.entries(SESSION_TYPES) as [SessionTypeName, (typeof SESSION_TYPES)[SessionTypeName]][]).map(
          ([type, config]) => {
            const info = sessionTypeInfo[type];
            const isSelected = value === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange(type)}
                disabled={disabled}
                className={cn(
                  'relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-felt-500 focus:ring-offset-2',
                  isSelected
                    ? 'border-felt-600 bg-felt-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-felt-300 hover:bg-gray-50',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="text-3xl mb-2">{info.emoji}</span>
                <span className={cn('font-semibold', isSelected ? 'text-felt-700' : 'text-gray-900')}>
                  {config.label}
                </span>
                <span className="text-sm text-gray-500">{config.duration} min</span>
                <span className="text-xs text-gray-400 mt-1">{info.description}</span>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <svg
                      className="w-5 h-5 text-felt-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}
