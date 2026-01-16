'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

interface QualityRatingProps {
  value: number | null;
  onChange: (rating: number) => void;
  disabled?: boolean;
  className?: string;
}

const ratingLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

export function QualityRating({
  value,
  onChange,
  disabled = false,
  className,
}: QualityRatingProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="block text-sm font-medium text-gray-700">
        How was your focus quality?
      </label>
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isSelected = value !== null && rating <= value;
          const isHovered = value === rating;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              disabled={disabled}
              className={cn(
                'p-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-chip-gold focus:ring-offset-2 rounded',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              aria-label={`${rating} star${rating > 1 ? 's' : ''} - ${ratingLabels[rating - 1]}`}
            >
              <svg
                className={cn(
                  'w-10 h-10 md:w-12 md:h-12 transition-all duration-200',
                  isSelected ? 'text-chip-gold' : 'text-gray-300',
                  !disabled && 'hover:scale-110'
                )}
                fill={isSelected ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-center text-sm text-gray-600">
          {ratingLabels[value - 1]} - +{value * 20} bonus chips
        </p>
      )}
    </div>
  );
}
