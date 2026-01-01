import { test, expect } from '@playwright/test';

test.describe('Vietnamese Connections Game', () => {
  test('should load the game page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Vietnamese Connections')).toBeVisible();
  });

  test('should display 16 word cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for puzzle to load
    
    const wordCards = page.locator('.word-card');
    await expect(wordCards).toHaveCount(16);
  });

  test('should select and deselect words', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const firstWord = page.locator('.word-card').first();
    await firstWord.click();
    
    // Check if word is selected
    await expect(firstWord).toHaveClass(/selected/);
    
    // Deselect
    await firstWord.click();
    await expect(firstWord).not.toHaveClass(/selected/);
  });

  test('should limit selection to 4 words', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const words = page.locator('.word-card');
    
    // Select 5 words
    for (let i = 0; i < 5; i++) {
      await words.nth(i).click();
    }
    
    // Check that only 4 are selected
    const selectedWords = page.locator('.word-card.selected');
    await expect(selectedWords).toHaveCount(4);
  });

  test('should enable submit button when 4 words selected', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    const submitButton = page.getByRole('button', { name: /Gửi đáp án/i });
    await expect(submitButton).toBeDisabled();
    
    // Select 4 words
    const words = page.locator('.word-card');
    for (let i = 0; i < 4; i++) {
      await words.nth(i).click();
    }
    
    await expect(submitButton).toBeEnabled();
  });

  test('should show attempts indicator', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    await expect(page.getByText(/Còn lại.*lần thử/)).toBeVisible();
  });

  test('should toggle between daily and unlimited modes', async ({ page }) => {
    await page.goto('/');
    
    const dailyButton = page.getByRole('button', { name: /Hàng ngày/i });
    const unlimitedButton = page.getByRole('button', { name: /Không giới hạn/i });
    
    await expect(dailyButton).toBeVisible();
    await expect(unlimitedButton).toBeVisible();
    
    await unlimitedButton.click();
    await page.waitForTimeout(1000);
  });

  test('should clear selection', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Select 3 words
    const words = page.locator('.word-card');
    for (let i = 0; i < 3; i++) {
      await words.nth(i).click();
    }
    
    // Click clear button
    await page.getByRole('button', { name: /Xóa chọn/i }).click();
    
    // Check no words are selected
    const selectedWords = page.locator('.word-card.selected');
    await expect(selectedWords).toHaveCount(0);
  });
});
