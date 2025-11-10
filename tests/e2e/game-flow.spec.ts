import { expect, test } from '@playwright/test';

/**
 * E2E Test: Simplified Game Creation Flow
 *
 * Tests the simplified navigation:
 * 1. User lands on JoinPage (/)
 * 2. User navigates to CreatePage (/create)
 * 3. User creates a game with episodes
 * 4. User is redirected back to JoinPage with sessionId
 * 5. Session state persists via cookies
 */

test.describe('Simplified Game Flow', () => {
  test('should complete game creation and return to join page', async ({ page }) => {
    // STEP 1: Navigate to root, should be on JoinPage
    await test.step('User lands on JoinPage', async () => {
      await page.goto('/');

      // Should be on join page (either / or /join)
      await expect(page.locator('text=ゲームに参加').or(page.locator('text=参加'))).toBeVisible({
        timeout: 5000,
      });
    });

    // STEP 2: Navigate to CreatePage
    await test.step('User navigates to CreatePage', async () => {
      // Click "Create Game" button
      await page.click('button:has-text("ゲームを作成")');

      // Should navigate to /create
      await page.waitForURL(/\/create/);

      // Verify CreatePage loaded
      await expect(page.locator('text=エピソードを追加').or(page.locator('text=新しいゲーム'))).toBeVisible();
    });

    // STEP 3: Create a game with episodes
    let sessionId: string;
    await test.step('User creates game with episodes', async () => {
      // Fill in at least one episode
      const episodeInput = page.locator('textarea').first();
      await episodeInput.fill('I have visited 30 countries');

      // Submit the form
      await page.click('button:has-text("ゲームを作成")');

      // Should redirect to /join with sessionId query param
      await page.waitForURL(/\/join\?sessionId=([A-Z0-9]+)/);

      // Extract session ID from URL
      const url = page.url();
      const match = url.match(/sessionId=([A-Z0-9]+)/);
      expect(match).toBeTruthy();
      sessionId = match![1];
    });

    // STEP 4: Verify back on JoinPage with session info
    await test.step('User sees created session on JoinPage', async () => {
      // Should display session ID somewhere on the page
      await expect(page.locator(`text=${sessionId}`)).toBeVisible({ timeout: 5000 });
    });

    // STEP 5: Verify session persists via cookie
    await test.step('Session state persists after refresh', async () => {
      // Refresh the page
      await page.reload();

      // Session ID should still be visible (from cookie)
      await expect(page.locator(`text=${sessionId}`)).toBeVisible({ timeout: 5000 });
    });
  });

  test('should show 404 for removed routes', async ({ page }) => {
    await test.step('Removed /game route shows 404', async () => {
      const response = await page.goto('/game/ABC1234567');

      // Should return 404 status
      expect(response?.status()).toBe(404);

      // Should show 404 page with link to join
      await expect(page.locator('text=404').or(page.locator('text=Page Not Found'))).toBeVisible({
        timeout: 5000,
      });
      await expect(page.locator('a[href="/join"]')).toBeVisible();
    });

    await test.step('Removed /results route shows 404', async () => {
      const response = await page.goto('/results/ABC1234567');

      // Should return 404 status
      expect(response?.status()).toBe(404);

      // Should show 404 page
      await expect(page.locator('text=404').or(page.locator('text=Page Not Found'))).toBeVisible({
        timeout: 5000,
      });
    });

    await test.step('Removed /host route shows 404', async () => {
      const response = await page.goto('/host/ABC1234567');

      // Should return 404 status
      expect(response?.status()).toBe(404);

      // Should show 404 page
      await expect(page.locator('text=404').or(page.locator('text=Page Not Found'))).toBeVisible({
        timeout: 5000,
      });
    });

    await test.step('Removed /manage route shows 404', async () => {
      const response = await page.goto('/manage/ABC1234567');

      // Should return 404 status
      expect(response?.status()).toBe(404);

      // Should show 404 page
      await expect(page.locator('text=404').or(page.locator('text=Page Not Found'))).toBeVisible({
        timeout: 5000,
      });
    });

    await test.step('404 page has working link back to join', async () => {
      await page.goto('/game/INVALID');

      // Click "Go to Join Page" link
      await page.click('a[href="/join"]');

      // Should navigate to join page
      await page.waitForURL(/\/join/);

      // Verify on join page
      await expect(page.locator('text=ゲームに参加').or(page.locator('text=参加'))).toBeVisible();
    });
  });

  test('should handle game creation validation', async ({ page }) => {
    await page.goto('/create');

    // Try to create without episodes - should show validation
    await page.click('button:has-text("ゲームを作成")');

    // Should show error message
    await expect(page.locator('.text-red-600, [class*="error"]').first()).toBeVisible({
      timeout: 2000,
    });

    // Fill in valid episode and create
    const episodeInput = page.locator('textarea').first();
    await episodeInput.fill('Valid episode content');
    await page.click('button:has-text("ゲームを作成")');

    // Should navigate to join page with sessionId
    await page.waitForURL(/\/join\?sessionId=[A-Z0-9]+/, { timeout: 10000 });
  });

  test('should display loading states during creation', async ({ page }) => {
    await page.goto('/create');

    // Fill in episode
    const episodeInput = page.locator('textarea').first();
    await episodeInput.fill('Test episode');

    // Click create button
    const createButton = page.locator('button:has-text("ゲームを作成")');
    await createButton.click();

    // Should show loading state
    await expect(
      page.locator('button:has-text("作成中..."), button:has-text("処理中..."), button:disabled')
    ).toBeVisible({ timeout: 1000 });
  });

  test('should allow navigation between join and create pages', async ({ page }) => {
    // Start on join page
    await page.goto('/');

    // Navigate to create
    await page.click('button:has-text("ゲームを作成")');
    await page.waitForURL(/\/create/);

    // Use browser back button to return to join
    await page.goBack();
    await page.waitForURL(/\/(join)?$/);

    // Verify back on join page
    await expect(page.locator('text=ゲームに参加').or(page.locator('text=参加'))).toBeVisible();
  });
});
