'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CategoryCard, CategoryForm, DeleteCategoryModal, type CategoryData } from '@/components/settings';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/lib/store/authStore';

export default function CategoriesPage() {
  const { initialize } = useAuthStore();

  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/categories', {
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError('Please log in to view categories');
        } else {
          setError(errorData.error || 'Failed to load categories');
        }
        return;
      }

      const data = await res.json();
      setCategories(data.categories);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: CategoryData) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: CategoryData) => {
    setDeletingCategory(category);
  };

  const handleFormSubmit = async (data: { name: string; color: string }) => {
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Update existing category
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update category');
        }
      } else {
        // Create new category
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create category');
        }
      }

      setShowForm(false);
      setEditingCategory(null);
      await fetchCategories();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/categories/${deletingCategory.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      setDeletingCategory(null);
      await fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingCategory(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-poker-felt-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🏷️</div>
          <p className="text-neutral-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-poker-felt-dark">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎰</span>
              <span className="text-xl font-bold text-white">Study Poker</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-neutral-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/session" className="text-neutral-300 hover:text-white transition-colors">
                Timer
              </Link>
              <Link href="/history" className="text-neutral-300 hover:text-white transition-colors">
                History
              </Link>
              <Link href="/categories" className="text-poker-gold font-medium">
                Categories
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
            <p className="text-neutral-400">
              Organize your study sessions by category
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={showForm}
          >
            + New Category
          </Button>
        </div>

        {error && (
          <Card className="p-8 text-center mb-8">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchCategories}>
              Try Again
            </Button>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Category list */}
          <div className="space-y-4">
            {categories.length === 0 && !error ? (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-4">📂</div>
                <p className="text-neutral-400 mb-4">No categories yet</p>
                <Button variant="primary" onClick={handleCreate}>
                  Create Your First Category
                </Button>
              </Card>
            ) : (
              categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          {/* Form panel */}
          {showForm && (
            <Card className="p-6 h-fit">
              <CategoryForm
                category={editingCategory}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isSubmitting}
              />
            </Card>
          )}
        </div>
      </main>

      {/* Delete confirmation modal */}
      {deletingCategory && (
        <DeleteCategoryModal
          category={deletingCategory}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
