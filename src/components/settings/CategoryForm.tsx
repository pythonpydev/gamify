'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ColorPicker } from '@/components/ui/ColorPicker';
import type { CategoryData } from './CategoryCard';

export interface CategoryFormProps {
  category?: CategoryData | null;
  onSubmit: (data: { name: string; color: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || '#6366f1');
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    if (name.trim().length > 50) {
      setError('Category name must be 50 characters or less');
      return;
    }

    try {
      await onSubmit({ name: name.trim(), color });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-white">
        {isEditing ? 'Edit Category' : 'Create Category'}
      </h3>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="categoryName" className="block text-sm font-medium text-neutral-300 mb-1">
          Name
        </label>
        <Input
          id="categoryName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Mathematics, Programming"
          maxLength={50}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Color
        </label>
        <ColorPicker
          value={color}
          onChange={setColor}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
