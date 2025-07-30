import { test, expect } from '@playwright/test';

test.describe('Parts Ordering Demo Flow', () => {
  test('Complete parts ordering workflow demo', async ({ page }) => {
    // Start the app
    await page.goto('http://localhost:3000');
    
    // Wait for the app to load
    await expect(page.locator('h1')).toBeVisible();
    
    // Step 1: Initial Parts Request
    console.log('Step 1: Initial Parts Request');
    await page.fill('textarea[placeholder="Type anything..."]', 'I need parts for the production line');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Wait for response and planning chip
    await expect(page.locator('.MuiChip-root:has-text("Planning")')).toBeVisible();
    
    // Wait 3 seconds before next step
    await page.waitForTimeout(3000);
    
    // Step 2: Provide Specifications
    console.log('Step 2: Provide Specifications');
    await page.fill('textarea[placeholder="Type anything..."]', 'I need a 15HP motor with 380V for standard shift operation');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Wait for Oracle ERP API call chip
    await expect(page.locator('.MuiChip-root:has-text("Calling Oracle Fusion ERP API")')).toBeVisible();
    await page.waitForTimeout(2000);
    
    // Step 3: Advisory Request
    console.log('Step 3: Advisory Request');
    await page.fill('textarea[placeholder="Type anything..."]', 'Advise me, but I want to decide');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Wait for RAG knowledge base query
    await expect(page.locator('.MuiChip-root:has-text("Querying RAG Knowledge Base")')).toBeVisible();
    await page.waitForTimeout(3000);
    
    // Wait for radar chart to appear
    await expect(page.locator('canvas')).toBeVisible();
    await page.waitForTimeout(2000);
    
    // Step 4: Select HD-2024 Part
    console.log('Step 4: Select HD-2024 Part');
    await expect(page.locator('button:has-text("HD-2024")')).toBeVisible();
    await page.click('button:has-text("HD-2024 - Heavy-duty conveyor belt motor (15HP, 380V)")');
    
    // Wait for part selection to process
    await page.waitForTimeout(2000);
    
    // Step 5: Request Quotes
    console.log('Step 5: Request Quotes');
    await page.fill('textarea[placeholder="Type anything..."]', 'Ask all 3 suppliers for their prices');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Wait for supplier contact process
    await expect(page.locator('.MuiChip-root')).toBeVisible();
    await page.waitForTimeout(3000);
    
    // Step 6: Analyze Offers
    console.log('Step 6: Analyze Offers');
    await page.fill('textarea[placeholder="Type anything..."]', 'Analyze current offers (2 received)');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Wait for analysis to complete
    await page.waitForTimeout(3000);
    
    // Step 7: Create Order
    console.log('Step 7: Create Order');
    await page.fill('textarea[placeholder="Type anything..."]', 'Create order with TechParts Inc ($2,970)');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Wait for order creation process
    await expect(page.locator('.MuiChip-root')).toBeVisible();
    await page.waitForTimeout(3000);
    
    // Step 8: Track Status
    console.log('Step 8: Track Status');
    await page.fill('textarea[placeholder="Type anything..."]', 'Track order status');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Wait for final status update
    await page.waitForTimeout(3000);
    
    console.log('Demo flow completed successfully!');
  });
  
  test('Demo flow with detailed assertions', async ({ page }) => {
    // Start the app
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toBeVisible();
    
    // Step 1: Initial Parts Request
    await page.fill('[data-testid="chat-input"]', 'I need parts for the production line');
    await page.click('[data-testid="send-button"]');
    
    // Verify planning chip appears
    await expect(page.locator('.MuiChip-root:has-text("Planning")')).toBeVisible();
    
    // Verify specification request appears
    await expect(page.locator('text=What power rating do you need?')).toBeVisible();
    
    // Step 2: Provide specifications
    await page.fill('textarea[placeholder="Type anything..."]', 'I need a 15HP motor with 380V for standard shift operation');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Step 3: Request advisory
    await page.fill('textarea[placeholder="Type anything..."]', 'Advise me, but I want to decide');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    // Verify Oracle ERP API call
    await expect(page.locator('.MuiChip-root:has-text("Calling Oracle Fusion ERP API")')).toBeVisible();
    
    // Verify RAG knowledge base query
    await expect(page.locator('.MuiChip-root:has-text("Querying RAG Knowledge Base")')).toBeVisible();
    
    // Verify radar chart appears
    await expect(page.locator('canvas')).toBeVisible();
    
    // Verify part selection buttons appear
    await expect(page.locator('button:has-text("HD-2024")')).toBeVisible();
    await expect(page.locator('button:has-text("HD-2025")')).toBeVisible();
    
    // Select HD-2024
    await page.click('button:has-text("HD-2024 - Heavy-duty conveyor belt motor (15HP, 380V)")');
    
    // Continue with rest of flow...
    await page.fill('textarea[placeholder="Type anything..."]', 'Ask all 3 suppliers for their prices');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    await page.waitForTimeout(2000);
    
    await page.fill('textarea[placeholder="Type anything..."]', 'Analyze current offers (2 received)');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    await page.waitForTimeout(2000);
    
    await page.fill('textarea[placeholder="Type anything..."]', 'Create order with TechParts Inc ($2,970)');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    await page.waitForTimeout(2000);
    
    await page.fill('textarea[placeholder="Type anything..."]', 'Track order status');
    await page.press('textarea[placeholder="Type anything..."]', 'Enter');
    
    await page.waitForTimeout(2000);
  });
});