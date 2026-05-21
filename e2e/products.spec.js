import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', 'john@licensehub.io')
  await page.fill('#password', 'password')
  await page.click('button:has-text("Sign In")')
  await expect(page).toHaveURL(/\/dashboard/)
})

test.describe('Products', () => {
  test('lists all products', async ({ page }) => {
    await page.goto('/products')
    await expect(page.locator('text=Enterprise ERP').first()).toBeVisible()
    await expect(page.locator('text=CloudPOS').first()).toBeVisible()
    await expect(page.locator('text=API Gateway').first()).toBeVisible()
    await expect(page.locator('text=DataVault').first()).toBeVisible()
  })

  test('creates a product', async ({ page }) => {
    await page.goto('/products')
    await page.click('button:has-text("Create Product")')

    // Fill form in the modal
    await page.fill('input[placeholder="Enterprise ERP"]', 'Test Product')
    await page.fill('input[placeholder="ERP"]', 'TST')
    await page.locator('textarea').fill('A product created via test')

    // Click the submit button inside the modal (not the page header one)
    await page.locator('.fixed.inset-0.z-50 button:has-text("Create Product")').click()

    // Dismiss API key modal
    await expect(page.locator('text=Product API Key Generated')).toBeVisible()
    await page.click('button:has-text("Done")')

    await expect(page.locator('text=Test Product').first()).toBeVisible()
  })

  test('views product detail', async ({ page }) => {
    await page.goto('/products')
    await page.locator('svg.lucide-eye').first().click()
    await expect(page).toHaveURL(/\/products\/prod_1/)
    await expect(page.locator('text=Enterprise ERP').first()).toBeVisible()
  })

  test('edits a product', async ({ page }) => {
    await page.goto('/products')
    await page.locator('svg.lucide-pencil').first().click()

    await page.fill('input[placeholder="Enterprise ERP"]', 'ERP Updated')

    // Click update button inside modal
    await page.locator('.fixed.inset-0.z-50 button:has-text("Update Product")').click()

    await expect(page.locator('text=ERP Updated').first()).toBeVisible()
  })

  test('shows product detail with features and API key', async ({ page }) => {
    await page.goto('/products/prod_1')
    await expect(page.locator('text=Enterprise ERP').first()).toBeVisible()
    await expect(page.locator('text=Feature Flags').first()).toBeVisible()
  })
})
