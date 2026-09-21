import { expect, test, type Page } from '@playwright/test';

async function restore(page: Page) {
  await page.locator('[data-dialog="settings"]').click();
  await page.locator('#restore-dashboard').click();
  await expect(page.locator('#detail-dialog')).not.toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hola, maestro Luis');
});

test('task changes survive reload and notifications reflect the pending tasks', async ({
  page,
}) => {
  await expect(page.locator('#task-count')).toHaveText('2/5');
  await expect(page.locator('#pending-count')).toHaveText('3');
  await expect(page.locator('.onboarding-percentage')).toHaveText('40%');
  await page.locator('[data-task="curso"]').click();
  await expect(page.locator('#task-count')).toHaveText('3/5');
  await expect(page.locator('#pending-count')).toHaveText('2');
  await expect(page.locator('.onboarding-percentage')).toHaveText('60%');
  await page.reload();
  await expect(page.locator('[data-task="curso"]')).toHaveAttribute('aria-checked', 'true');
  await expect(page.locator('#task-count')).toHaveText('3/5');
  for (const id of ['guia', 'avisos']) await page.locator(`[data-task="${id}"]`).click();
  await expect(page.locator('#pending-count')).toHaveText('0');
  await expect(page.locator('.onboarding-percentage')).toHaveText('100%');
  await page.locator('[data-dialog="notifications"]').click();
  await expect(page.locator('#dialog-content')).toContainText('No tienes pendientes');
  await page.keyboard.press('Escape');
  await restore(page);
  await expect(page.locator('#task-count')).toHaveText('2/5');
});

test('timer starts, pauses, persists, resets, and shares its state with the dialog', async ({
  page,
}) => {
  await expect(page.locator('#timer-display')).toHaveText('02:35');
  await page.locator('#timer-play').click();
  await expect(page.locator('#timer-display')).not.toHaveText('02:35');
  await page.locator('#timer-pause').click();
  const paused = await page.locator('#timer-display').innerText();
  await page.clock.install();
  await page.clock.fastForward(2500);
  await expect(page.locator('#timer-display')).toHaveText(paused);
  await page.reload();
  await expect(page.locator('#timer-display')).toHaveText(paused);
  await page.locator('[data-dialog="timer"]').click();
  await expect(page.locator('#modal-timer')).toHaveText(paused);
  await page.getByRole('button', { name: 'Iniciar estudio', exact: true }).last().click();
  await expect(
    page.getByRole('button', { name: 'Pausar estudio', exact: true }).last(),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Pausar estudio', exact: true }).last().click();
  await page.keyboard.press('Escape');
  await page.locator('#timer-reset').click();
  await expect(page.locator('#timer-display')).toHaveText('00:00');
  await restore(page);
  await expect(page.locator('#timer-display')).toHaveText('02:35');
});

test('calendar month navigation, event details and employee accordions work', async ({ page }) => {
  await page.locator('#next-month').click();
  await expect(page.locator('#calendar-month')).toHaveText('Octubre 2026');
  await expect(page.locator('#calendar-empty')).toBeVisible();
  await expect(page.locator('.calendar-event')).toHaveCount(0);
  await page.locator('#back-to-september').click();
  await expect(page.locator('#calendar-month')).toHaveText('Septiembre 2026');
  await page.locator('.team-event').click();
  await expect(page.locator('#dialog-title')).toHaveText('Repaso de la guía');
  await page.keyboard.press('Escape');
  await page.locator('summary').filter({ hasText: 'Mi participación' }).click();
  await expect(page.locator('#devices-details')).not.toHaveAttribute('open');
  await expect(page.locator('details[open]')).toContainText('AB-DEMO');
  await page.locator('#devices-details summary').click();
  await expect(page.locator('details[open]')).toContainText('Educación primaria');
});

test('navigation dialogs retain keyboard focus and restore it on Escape', async ({ page }) => {
  for (const item of ['People', 'Hiring', 'Devices', 'Apps', 'Salary', 'Reviews']) {
    const opener = page.locator(`.nav-link[data-nav="${item}"]`);
    await opener.click();
    await expect(page.locator('#detail-dialog')).toBeVisible();
    await page.locator('#close-dialog').focus();
    await page.keyboard.press('Shift+Tab');
    await expect
      .poll(() =>
        page.locator('#detail-dialog').evaluate((node) => node.contains(document.activeElement)),
      )
      .toBe(true);
    await page.keyboard.press('Tab');
    await expect
      .poll(() =>
        page.locator('#detail-dialog').evaluate((node) => node.contains(document.activeElement)),
      )
      .toBe(true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#detail-dialog')).not.toBeVisible();
    await expect(opener).toBeFocused();
  }
});

test('preferences persist and opting out of remembering clears session edits on reload', async ({
  page,
}) => {
  await page.locator('[data-dialog="settings"]').click();
  await page.locator('#setting-motion').check();
  await page.locator('#setting-remember').uncheck();
  await page.locator('#save-settings').click();
  await expect(page.locator('#detail-dialog')).not.toBeVisible();
  await expect(page.locator('html')).toHaveClass('reduce-motion');
  await page.locator('[data-task="guia"]').click();
  await expect(page.locator('#task-count')).toHaveText('3/5');
  await page.reload();
  await expect(page.locator('html')).toHaveClass('reduce-motion');
  await expect(page.locator('#task-count')).toHaveText('2/5');
  await page.locator('[data-dialog="settings"]').click();
  await expect(page.locator('#setting-remember')).not.toBeChecked();
  await expect(page.locator('#setting-motion')).toBeChecked();
});

test('mobile calendar can be scrolled by keyboard and dialogs fit in the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-task="guia"]').click();
  await expect(page.locator('#task-count')).toHaveText('3/5');
  const calendar = page.locator('.calendar-scroll');
  await calendar.scrollIntoViewIfNeeded();
  await calendar.focus();
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
  await expect.poll(() => calendar.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  await page.locator('[data-dialog="settings"]').click();
  const bounds = await page.locator('#detail-dialog').boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await page.locator('#close-dialog').click();
});

test('default local mode loads its own assets with no external requests or browser errors', async ({
  page,
}) => {
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('request', (request) => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).hostname !== '127.0.0.1')
      external.push(request.url());
  });
  await page.reload();
  await expect(page.locator('#task-count')).toHaveText('2/5');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px Outfit'))).toBe(true);
  await page.locator('[data-task="curso"]').click();
  await expect(page.locator('#task-count')).toHaveText('3/5');
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

for (const width of [320, 375, 390, 560, 561, 768, 800, 1024, 1250, 1251, 1440, 1600, 1824]) {
  test(`layout at ${width}px has no page overflow and retains its main content`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width >= 1024 ? 1200 : 844 });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.locator('#timer-display')).toBeVisible();
    await expect(page.locator('#task-count')).toHaveText('2/5');
    await expect(page.locator('#calendar-month')).toHaveText('Septiembre 2026');
  });
}
