'use client';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { CategoryData } from './CategoryCard';

export interface DeleteCategoryModalProps {
  category: CategoryData;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export function DeleteCategoryModal({
  category,
  onConfirm,
  onCancel,
  isLoading = false,
  className,
}: DeleteCategoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className={cn('max-w-md w-full p-6', className)}>
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Delete Category?
          </h3>
          <p className="text-neutral-400">
            Are you sure you want to delete <strong className="text-white">{category.name}</strong>?
          </p>
        </div>

        {category.sessionCount && category.sessionCount > 0 && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg">
            <p className="text-amber-400 text-sm">
              ⚠️ This category has {category.sessionCount} {category.sessionCount === 1 ? 'session' : 'sessions'} associated with it.
              Those sessions will remain but will show as &quot;Uncategorized&quot;.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
