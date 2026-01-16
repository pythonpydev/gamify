'use client';

import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface CategoryData {
  id: string;
  name: string;
  color: string;
  isDefault?: boolean;
  sessionCount?: number;
}

export interface CategoryCardProps {
  category: CategoryData;
  onEdit: (category: CategoryData) => void;
  onDelete: (category: CategoryData) => void;
  className?: string;
}

export function CategoryCard({
  category,
  onEdit,
  onDelete,
  className,
}: CategoryCardProps) {
  return (
    <Card
      className={cn('flex items-center justify-between p-4', className)}
      data-testid="category-card"
    >
      <div className="flex items-center gap-3">
        {/* Color indicator */}
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />

        {/* Category info */}
        <div>
          <span
            className="font-medium text-white"
            data-testid="category-name"
          >
            {category.name}
          </span>
          {category.sessionCount !== undefined && (
            <p className="text-sm text-neutral-400">
              {category.sessionCount} {category.sessionCount === 1 ? 'session' : 'sessions'}
            </p>
          )}
          {category.isDefault && (
            <span className="text-xs text-neutral-500 ml-2">(Default)</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(category)}
          aria-label="Edit category"
        >
          ✏️ Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(category)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          aria-label="Delete category"
        >
          🗑️ Delete
        </Button>
      </div>
    </Card>
  );
}
