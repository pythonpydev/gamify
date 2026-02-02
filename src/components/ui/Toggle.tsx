'use client';

import { cn } from '@/lib/utils/cn';

export interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Toggle({ enabled, onChange, label, disabled = false, className }: ToggleProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          enabled ? 'bg-poker-gold' : 'bg-neutral-700',
          disabled && 'cursor-not-allowed'
        )}
        onClick={() => !disabled && onChange(!enabled)}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </div>
      {label && (
        <span className={cn('text-sm font-medium', enabled ? 'text-white' : 'text-neutral-400')}>
          {label}
        </span>
      )}
    </label>
  );
}
