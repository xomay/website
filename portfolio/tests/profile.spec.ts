import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('a recruiter can identify the candidate, assess availability and reach his contacts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mathys Dubois');
  await expect(page.getByText(/six.month internship/i).first()).toBeVisible();
  await expect(page.getByText('15 February 2027', { exact: true })).toBeVisible();
  await expect(page.getByText(/across France/i).first()).toBeVisible();
  for (const topic of ['Medical imaging', 'Oncology', 'Neuroscience']) {
    await expect(page.getByRole('heading', { name: topic })).toBeVisible();
  }
  const contact = page.getByRole('region', { name: 'Get in touch' });
  await expect(contact.getByRole('link', { name: /mathys.dubois@insa-rennes.fr/i })).toHaveAttribute('href', 'mailto:mathys.dubois@insa-rennes.fr');
  await expect(contact.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/xomay');
  await expect(contact.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/mathys-dubois-43a728263/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('download the approved CV and reach each contact using only the keyboard', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: /download cv/i });
  for (let step = 0; step < 15; step++) {
    await page.keyboard.press('Tab');
    if (await link.evaluate(el => el === document.activeElement)) break;
  }
  await expect(link).toBeFocused();
  const downloadEvent = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  const download = await downloadEvent;
  const pdf = await readFile(await download.path());
  expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
  // Digest of the site-specific PDF supplied by Mathys on 11 November 2026.
  expect(createHash('sha256').update(pdf).digest('hex')).toBe('29c8af4852e0a6bb074a8968052f80c57df1e152a77de9760a7dfa0c13f995ed');

  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Get in touch' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#contact$/);
  for (const name of ['mathys.dubois@insa-rennes.fr', 'GitHub', 'LinkedIn']) {
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name, exact: true })).toBeFocused();
  }
});
