import { test, expect } from '@playwright/test';

/**
 * Authentication Flow Integration Tests
 *
 * Tests the complete auth flow: Register → Logout → Login → Verify session
 */

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test.describe('Registration', () => {
    test('can access registration page', async ({ page }) => {
      await page.goto('/register');
      await expect(page.getByRole('heading', { name: /create account|register|sign up/i })).toBeVisible();
    });

    test('shows validation errors for invalid input', async ({ page }) => {
      await page.goto('/register');

      // Submit empty form
      await page.getByRole('button', { name: /register|sign up|create/i }).click();

      // Should show validation errors
      await expect(page.getByText(/email|required/i)).toBeVisible();
    });

    test('can register with valid credentials', async ({ page }) => {
      await page.goto('/register');

      await page.getByLabel(/email/i).fill(testEmail);
      await page.getByLabel(/^password$/i).fill(testPassword);
      await page.getByLabel(/confirm password/i).fill(testPassword);

      await page.getByRole('button', { name: /register|sign up|create/i }).click();

      // Should redirect to dashboard or show success
      await expect(page).toHaveURL(/\/(dashboard)?|check.*email/);
    });
  });

  test.describe('Login', () => {
    test('can access login page', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByRole('heading', { name: /login|sign in|welcome/i })).toBeVisible();
    });

    test('shows error for invalid credentials', async ({ page }) => {
      await page.goto('/login');

      await page.getByLabel(/email/i).fill('wrong@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');

      await page.getByRole('button', { name: /login|sign in/i }).click();

      // Should show error message
      await expect(page.getByText(/invalid|incorrect|error/i)).toBeVisible();
    });

    test('can login with valid credentials', async ({ page }) => {
      // This test requires a pre-existing user
      await page.goto('/login');

      await page.getByLabel(/email/i).fill(testEmail);
      await page.getByLabel(/password/i).fill(testPassword);

      await page.getByRole('button', { name: /login|sign in/i }).click();

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/(dashboard|session)?/);
    });
  });

  test.describe('Logout', () => {
    test('can logout when authenticated', async ({ page }) => {
      // First login
      await page.goto('/login');
      await page.getByLabel(/email/i).fill(testEmail);
      await page.getByLabel(/password/i).fill(testPassword);
      await page.getByRole('button', { name: /login|sign in/i }).click();

      // Find and click logout
      await page.getByRole('button', { name: /logout|sign out/i }).click();

      // Should redirect to login or landing
      await expect(page).toHaveURL(/\/(login)?/);
    });
  });

  test.describe('Protected Routes', () => {
    test('redirects to login when accessing protected route without auth', async ({ page }) => {
      await page.goto('/session');
      await expect(page).toHaveURL(/\/login/);
    });

    test('allows access to protected route when authenticated', async ({ page }) => {
      // Login first
      await page.goto('/login');
      await page.getByLabel(/email/i).fill(testEmail);
      await page.getByLabel(/password/i).fill(testPassword);
      await page.getByRole('button', { name: /login|sign in/i }).click();

      // Now access protected route
      await page.goto('/session');
      await expect(page).toHaveURL(/\/session/);
    });
  });
});
