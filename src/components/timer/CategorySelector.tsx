'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
}

interface CategorySelectorProps {
  categories: Category[];
  value: string | null;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CategorySelector({
  categories,
  value,
  onChange,
  disabled = false,
  className,
}: CategorySelectorProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-gray-700">Study Category</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {categories.map((category) => {
          const isSelected = value === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onChange(category.id)}
              disabled={disabled}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-felt-500 focus:ring-offset-2',
                isSelected
                  ? 'border-current shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              style={{
                borderColor: isSelected ? category.color : undefined,
                backgroundColor: isSelected ? `${category.color}15` : undefined,
              }}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />
              <span
                className={cn('font-medium truncate', isSelected ? 'text-gray-900' : 'text-gray-700')}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
