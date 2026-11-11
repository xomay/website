import { expect, test, type Locator, type Page } from '@playwright/test';
import { tabTo } from './keyboard.js';

test.use({ javaScriptEnabled: false });

async function followWithKeyboard(page: Page, link: Locator) {
  await tabTo(page, link);
  await page.keyboard.press('Enter');
}

test('discover Flower from All projects and return to the catalogue using the keyboard', async ({ page }) => {
  await page.goto('/');
  await followWithKeyboard(page, page.getByRole('navigation').getByRole('link', { name: 'All projects' }));
  const catalogue = page.getByRole('region', { name: 'All projects' });
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(catalogue).toBeFocused();
  const project = catalogue.getByRole('link');
  await expect(project).toHaveCount(1);
  await expect(project).toHaveAccessibleName(/Flower/);
  await followWithKeyboard(page, project);
  await expect(page).toHaveURL(/\/projects\/flower\/$/);
  await expect(page.getByRole('heading', { name: 'Flower', level: 1 })).toBeVisible();
  await followWithKeyboard(page, page.getByRole('link', { name: 'All projects', exact: true }));
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(catalogue).toBeInViewport();
});

test('read a shared Flower case study, refresh it and return to the profile', async ({ page }) => {
  expect((await page.goto('/projects/flower/'))?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1, name: 'Flower' })).toBeVisible();
  expect((await page.reload())?.status()).toBe(200);
  await expect(page).toHaveTitle(/Flower/);
  const project = page.getByRole('main');
  await expect(project).toContainText(/Ouest INSA.s information systems team/);
  await expect(project).toContainText(/I contributed to its development and maintenance/i);
  for (const technology of ['Vue 3', 'JavaScript', 'Python', 'Django REST Framework', 'MySQL', 'MariaDB']) {
    await expect(project).toContainText(technology);
  }
  const workflow = project.getByRole('figure', { name: /study.*agreement/i });
  await expect(workflow).toBeVisible();
  await expect(workflow).toContainText(/template/i);
  await expect(workflow).toContainText(/DOCX download/i);
  const contributions = project.getByRole('region', { name: 'My contributions' });
  for (const [name, example, commit] of [
    [/amendments/i, /reworked the amendment creation form and added an editing view/i, '60059fd'],
    [/requirements/i, /linked phases to the requirements/i, 'fda8be9'],
    [/PDF/i, /added PDF output/i, '440732d'],
  ] as const) {
    await expect(contributions).toContainText(example);
    await expect(contributions.getByRole('link', { name })).toHaveAttribute('href', new RegExp('^https://github.com/xomay/Flower/commit/' + commit));
  }
  await expect(project.getByRole('region', { name: 'Results and limits' })).toContainText(/usage|adoption/i);
  await expect(project.getByRole('link', { name: /public code/i })).toHaveAttribute('href', 'https://github.com/xomay/Flower');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await followWithKeyboard(page, page.getByRole('link', { name: 'Profile', exact: true }));
  await expect(page).toHaveURL(/\/#profile$/);
  await expect(page.getByRole('heading', { name: 'Mathys Dubois', level: 1 })).toBeInViewport();
});
