
import { test, expect } from '@playwright/test';

async function clearTasks(page) {
  const response = await page.request.get('/api/tasks');
  const body = await response.json();
  for (const task of body.tasks || []) {
    await page.request.delete(`/api/tasks/${task.id}`);
  }
}

async function createTask(page, { title, description = 'desc', status = 'Todo', dueDate = '' }) {
  await page.getByLabel('Title', { exact: true }).fill(title);
  await page.getByLabel('Description', { exact: true }).fill(description);
  await page.getByLabel('Status', { exact: true }).selectOption({ label: status });
  if (dueDate) await page.getByLabel('Due date', { exact: true }).fill(dueDate);
  await page.getByLabel('Save', { exact: true }).click();
  await expect(page.locator('tr', { hasText: title }).first()).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await clearTasks(page);
  await page.goto('/');
});

test('title is required (client validation)', async ({ page }) => {
  await page.getByLabel('Title').fill('');
  await page.getByLabel('Save').click();
  await expect(page.getByRole('alert')).toContainText('Title is required');
});

test('create task and search', async ({ page }) => {
  await createTask(page, { title: 'Alpha Task' });
  await createTask(page, { title: 'Beta Task' });

  await expect(page.getByText('Alpha Task')).toBeVisible();
  await expect(page.getByText('Beta Task')).toBeVisible();

  await page.getByLabel('Search').fill('Alpha');
  await expect(page.getByText('Alpha Task')).toBeVisible();
  await expect(page.getByText('Beta Task')).not.toBeVisible();
});

test('filter by status', async ({ page }) => {
  await createTask(page, { title: 'Todo 1', status: 'Todo' });
  await createTask(page, { title: 'Done 1', status: 'Done' });

  await page.getByLabel('Status filter').selectOption({ label: 'Done' });
  await expect(page.getByText('Done 1')).toBeVisible();
  await expect(page.getByText('Todo 1')).not.toBeVisible();
});

test('overdue task is highlighted', async ({ page }) => {
  const d = new Date(Date.now() - 24*60*60*1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  const ymd = `${yyyy}-${mm}-${dd}`;

  await createTask(page, { title: 'Overdue Task', dueDate: ymd, status: 'Todo' });

  const row = page.locator('tr', { hasText: 'Overdue Task' });
  await expect(row).toBeVisible();
  await expect(row).toHaveCSS('background-color', 'rgb(255, 243, 243)');
});