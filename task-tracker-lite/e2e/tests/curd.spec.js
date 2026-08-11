
import { test, expect } from '@playwright/test';

test('can create, edit, and delete a task', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Title').fill('My first task');
  await page.getByLabel('Description').fill('demo');
  await page.getByLabel('Save').click();
  await expect(page.getByText('My first task')).toBeVisible();

  await page.getByLabel('Edit My first task').click();
  await page.getByLabel('Title').fill('My updated task');
  await page.getByLabel('Save').click();
  await expect(page.getByText('My updated task')).toBeVisible();

  page.once('dialog', dialog => dialog.accept());
  await page.getByLabel('Delete My updated task').click();
  await expect(page.getByText('My updated task')).not.toBeVisible();
});