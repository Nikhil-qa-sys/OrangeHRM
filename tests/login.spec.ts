import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/login.page';

test.describe('login', () => {
  test('login page loads', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.expectLoaded();
  });

  test('valid credentials reach the dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(
      process.env.APP_USERNAME ?? 'Admin',
      process.env.APP_PASSWORD ?? 'admin123',
    );
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
