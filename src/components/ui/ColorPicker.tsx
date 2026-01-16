'use client';

import { cn } from '@/lib/utils/cn';

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#eab308', // yellow
  '#84cc16', // lime
  '#22c55e', // green
  '#10b981', // emerald
  '#14b8a6', // teal
  '#06b6d4', // cyan
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a855f7', // purple
  '#d946ef', // fuchsia
  '#ec4899', // pink
];

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ColorPicker({
  value,
  onChange,
  disabled = false,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Preset colors grid */}
      <div className="grid grid-cols-8 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => !disabled && onChange(color)}
            disabled={disabled}
            className={cn(
              'w-8 h-8 rounded-lg transition-all duration-150',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-900',
              value === color && 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900',
              disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
            )}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      {/* Custom color input */}
      <div className="flex items-center gap-3">
        <label htmlFor="customColor" className="text-sm text-neutral-400">
          Custom:
        </label>
        <input
          id="customColor"
          type="color"
          value={value}
          onChange={(e) => !disabled && onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            'w-10 h-10 rounded-lg cursor-pointer border-2 border-neutral-700',
            'focus:outline-none focus:ring-2 focus:ring-poker-gold',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <span className="text-sm text-neutral-400 font-mono uppercase">
          {value}
        </span>
      </div>
    </div>
  );
}
