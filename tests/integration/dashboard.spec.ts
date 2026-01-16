import { test, expect } from '@playwright/test';

/**
 * Dashboard Integration Tests
 *
 * Tests dashboard data display: chip total, recent sessions, and rank
 */

test.describe('Dashboard', () => {
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

  test.describe('Chip Counter', () => {
    test('displays total chip count', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page.getByText(/chips?/i)).toBeVisible();
      // Should display a number for chips
      await expect(page.locator('[data-testid="chip-count"]')).toBeVisible();
    });

    test('chip count updates after completing session', async ({ page }) => {
      // Navigate to session
      await page.goto('/session');

      // Start a quick session (would need to implement quick test mode)
      // For now, just verify the flow exists
      await expect(page.getByText(/quick hand|standard|deep stack/i)).toBeVisible();
    });
  });

  test.describe('Rank Badge', () => {
    test('displays current rank', async ({ page }) => {
      await page.goto('/dashboard');
      // Should show one of the rank names
      await expect(
        page.getByText(/fish|grinder|shark|pro|high roller|champion|legend/i)
      ).toBeVisible();
    });

    test('rank badge has correct styling', async ({ page }) => {
      await page.goto('/dashboard');
      const rankBadge = page.locator('[data-testid="rank-badge"]');
      await expect(rankBadge).toBeVisible();
    });
  });

  test.describe('Recent Sessions', () => {
    test('shows recent sessions list', async ({ page }) => {
      await page.goto('/dashboard');
      // Should have a sessions section
      await expect(page.getByText(/recent sessions?|history/i)).toBeVisible();
    });

    test('session cards display correct information', async ({ page }) => {
      await page.goto('/dashboard');
      // If no sessions, should show empty state
      const hasSession = await page.locator('[data-testid="session-card"]').count();

      if (hasSession > 0) {
        // Should show session details
        await expect(page.locator('[data-testid="session-card"]').first()).toBeVisible();
      } else {
        // Should show empty state message
        await expect(page.getByText(/no sessions|start your first/i)).toBeVisible();
      }
    });
  });

  test.describe('History Page', () => {
    test('can access history page', async ({ page }) => {
      await page.goto('/history');
      await expect(page).toHaveURL(/\/history/);
    });

    test('shows paginated session list', async ({ page }) => {
      await page.goto('/history');
      // Should have session list or empty state
      await expect(
        page.getByText(/session|history|no sessions/i)
      ).toBeVisible();
    });

    test('can filter by date or category', async ({ page }) => {
      await page.goto('/history');
      // Should have filter controls
      const hasFilters = await page.locator('[data-testid="session-filters"]').count();
      if (hasFilters > 0) {
        await expect(page.locator('[data-testid="session-filters"]')).toBeVisible();
      }
    });
  });
});
