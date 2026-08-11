
import { test, expect } from '@playwright/test';

test('can create and view a task', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Title').fill('My first task');
  await page.getByLabel('Description').fill('demo');
  await page.getByLabel('Save').click();

  await expect(page.getByText('My first task')).toBeVisible();
});