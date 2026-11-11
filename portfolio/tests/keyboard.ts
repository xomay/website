import { expect, type Locator, type Page } from '@playwright/test';

export async function tabTo(page: Page, target: Locator) {
  for (let step = 0; step < 20; step++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate(element => element === document.activeElement)) break;
  }
  await expect(target).toBeFocused();
}
