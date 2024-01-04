import { expect, test } from '@playwright/test';

test('Login page has a login button', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
});
