import { test, expect } from '@playwright/test';

/**
 * Category Management Integration Tests
 *
 * Tests category CRUD operations: Create → Edit → Delete
 */

test.describe('Category Management', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /login|sign in/i }).click();
    await page.waitForURL(/\/(session|dashboard)?/);
  });

  test.describe('Category List', () => {
    test('can access categories page', async ({ page }) => {
      await page.goto('/categories');
      await expect(page.getByRole('heading', { name: /categories/i })).toBeVisible();
    });

    test('shows default categories for new user', async ({ page }) => {
      await page.goto('/categories');
      // Should show at least one category
      await expect(page.locator('[data-testid="category-card"]').first()).toBeVisible();
    });
  });

  test.describe('Create Category', () => {
    test('can open create category form', async ({ page }) => {
      await page.goto('/categories');
      await page.getByRole('button', { name: /add|create|new/i }).click();
      await expect(page.getByLabel(/name/i)).toBeVisible();
    });

    test('shows validation for empty name', async ({ page }) => {
      await page.goto('/categories');
      await page.getByRole('button', { name: /add|create|new/i }).click();
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      await expect(page.getByText(/required|name/i)).toBeVisible();
    });

    test('can create a new category', async ({ page }) => {
      const categoryName = `Test Category ${Date.now()}`;

      await page.goto('/categories');
      await page.getByRole('button', { name: /add|create|new/i }).click();

      await page.getByLabel(/name/i).fill(categoryName);
      await page.getByRole('button', { name: /save|create|submit/i }).click();

      // Should see the new category in the list
      await expect(page.getByText(categoryName)).toBeVisible();
    });
  });

  test.describe('Edit Category', () => {
    test('can open edit category form', async ({ page }) => {
      await page.goto('/categories');

      // Click edit on first category
      await page.locator('[data-testid="category-card"]').first()
        .getByRole('button', { name: /edit/i }).click();

      await expect(page.getByLabel(/name/i)).toBeVisible();
    });

    test('can update category name', async ({ page }) => {
      const newName = `Updated ${Date.now()}`;

      await page.goto('/categories');

      // Click edit on first category
      await page.locator('[data-testid="category-card"]').first()
        .getByRole('button', { name: /edit/i }).click();

      await page.getByLabel(/name/i).fill(newName);
      await page.getByRole('button', { name: /save|update|submit/i }).click();

      // Should see the updated name
      await expect(page.getByText(newName)).toBeVisible();
    });
  });

  test.describe('Delete Category', () => {
    test('shows delete confirmation modal', async ({ page }) => {
      await page.goto('/categories');

      // Click delete on first category
      await page.locator('[data-testid="category-card"]').first()
        .getByRole('button', { name: /delete/i }).click();

      // Should show confirmation modal
      await expect(page.getByText(/confirm|are you sure/i)).toBeVisible();
    });

    test('can cancel deletion', async ({ page }) => {
      await page.goto('/categories');

      const firstCategoryName = await page.locator('[data-testid="category-card"]').first()
        .locator('[data-testid="category-name"]').textContent();

      // Click delete
      await page.locator('[data-testid="category-card"]').first()
        .getByRole('button', { name: /delete/i }).click();

      // Cancel
      await page.getByRole('button', { name: /cancel|no/i }).click();

      // Category should still exist
      await expect(page.getByText(firstCategoryName!)).toBeVisible();
    });

    test('can delete a category', async ({ page }) => {
      // First create a category to delete
      const categoryName = `ToDelete ${Date.now()}`;

      await page.goto('/categories');
      await page.getByRole('button', { name: /add|create|new/i }).click();
      await page.getByLabel(/name/i).fill(categoryName);
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      await expect(page.getByText(categoryName)).toBeVisible();

      // Now delete it
      await page.locator('[data-testid="category-card"]').filter({ hasText: categoryName })
        .getByRole('button', { name: /delete/i }).click();

      await page.getByRole('button', { name: /confirm|yes|delete/i }).click();

      // Should no longer be visible
      await expect(page.getByText(categoryName)).not.toBeVisible();
    });
  });

  test.describe('Category in Session', () => {
    test('new category appears in session category selector', async ({ page }) => {
      const categoryName = `Session Category ${Date.now()}`;

      // Create category
      await page.goto('/categories');
      await page.getByRole('button', { name: /add|create|new/i }).click();
      await page.getByLabel(/name/i).fill(categoryName);
      await page.getByRole('button', { name: /save|create|submit/i }).click();
      await expect(page.getByText(categoryName)).toBeVisible();

      // Go to session page
      await page.goto('/session');

      // Category should be selectable
      await expect(page.getByText(categoryName)).toBeVisible();
    });
  });
});
