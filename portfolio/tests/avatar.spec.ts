import { expect, test, type Locator } from '@playwright/test';
import { tabTo } from './keyboard.js';

const organs = ['Brain', 'Heart', 'Lungs'];

test('explore the organs, return focus and follow Flower from the briefcase using the keyboard', async ({ page }) => {
  await page.goto('/');
  const avatar = page.getByRole('region', { name: 'Anatomical avatar' });
  const illustration = avatar.getByRole('img', { name: /Mathys/ });
  await expect(illustration).toBeVisible();
  await illustration.evaluate((image: HTMLImageElement) => image.decode());
  for (const name of organs) {
    const control = avatar.getByRole('button', { name, exact: true });
    await tabTo(page, control);
    await page.keyboard.press('Enter');
    const panel = avatar.getByRole('region', { name, exact: true });
    await expect(panel.getByRole('heading', { name })).toBeFocused();
    await expect(panel.getByText('No projects yet.')).toBeVisible();
    await expect(panel.getByRole('link')).toHaveCount(0);
    if (name === 'Heart') {
      await page.keyboard.press('Escape');
    } else {
      await tabTo(page, panel.getByRole('button', { name: 'Close' }));
      await page.keyboard.press('Space');
    }
    await expect(panel).toBeHidden();
    await expect(control).toBeFocused();
  }
  await tabTo(page, avatar.getByRole('button', { name: 'Briefcase' }));
  await page.keyboard.press('Space');
  const briefcase = avatar.getByRole('region', { name: 'Briefcase' });
  await tabTo(page, briefcase.getByRole('link', { name: /Flower/ }));
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/projects\/flower\/$/);
  await expect(page.getByRole('heading', { name: 'Flower', level: 1 })).toBeVisible();
});

test('switch between organs and open the same Flower case study from the briefcase and catalogue', async ({ page, isMobile }) => {
  const activate = (control: Locator) => isMobile ? control.tap() : control.click();
  await page.goto('/');
  const avatar = page.getByRole('region', { name: 'Anatomical avatar' });
  for (const name of organs) {
    await activate(avatar.getByRole('button', { name, exact: true }));
    const panel = avatar.getByRole('region', { name, exact: true });
    await expect(panel.getByText('No projects yet.')).toBeVisible();
    await expect(avatar.getByRole('region')).toHaveCount(1);
  }
  await activate(avatar.getByRole('button', { name: 'Close' }));
  await expect(avatar.getByRole('button', { name: 'Lungs' })).toBeFocused();
  await activate(avatar.getByRole('button', { name: 'Briefcase' }));
  const panel = avatar.getByRole('region', { name: 'Briefcase' });
  const catalogue = page.getByRole('region', { name: 'All projects' });
  const catalogueEntry = catalogue.getByRole('link', { name: /Flower/ });
  const briefcaseEntry = panel.getByRole('link');
  await expect(briefcaseEntry).toHaveCount(1);
  await expect(briefcaseEntry).toHaveAccessibleName(/Flower/);
  await expect(briefcaseEntry).toHaveText(await catalogueEntry.innerText(), { useInnerText: true });
  const destination = await catalogueEntry.getAttribute('href');
  expect(destination).toBeTruthy();
  await expect(briefcaseEntry).toHaveAttribute('href', destination!);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await activate(briefcaseEntry);
  await expect(page).toHaveURL(/\/projects\/flower\/$/);
  await expect(page.getByRole('heading', { name: 'Flower', level: 1 })).toBeVisible();
  await activate(page.getByRole('link', { name: 'All projects' }));
  await expect(catalogue).toBeInViewport();
});
