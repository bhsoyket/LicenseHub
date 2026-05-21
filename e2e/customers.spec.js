import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', 'john@licensehub.io')
  await page.fill('#password', 'password')
  await page.click('button:has-text("Sign In")')
  await expect(page).toHaveURL(/\/dashboard/)
})

test.describe('Customers', () => {
  test('lists customers', async ({ page }) => {
    await page.goto('/customers')
    await expect(page.locator('text=Acme Corporation')).toBeVisible()
    await expect(page.locator('text=Globex Inc.')).toBeVisible()
  })

  test('creates a customer', async ({ page }) => {
    await page.goto('/customers')
    await page.click('button:has-text("Add Customer")')

    await page.fill('input[placeholder="Acme Corp"]', 'Test Corp')
    await page.fill('input[placeholder="john@acme.com"]', 'test@corp.com')
    await page.click('button:has-text("Create Customer")')

    await expect(page.locator('text=Test Corp')).toBeVisible()
  })

  test('views customer detail', async ({ page }) => {
    await page.goto('/customers')
    await page.locator('svg.lucide-eye').first().click()
    await expect(page).toHaveURL(/\/customers\/cust_1/)
    await expect(page.locator('text=Acme Corporation')).toBeVisible()
  })

  test('edits a customer', async ({ page }) => {
    await page.goto('/customers')
    await page.locator('svg.lucide-pencil').first().click()

    await page.fill('input[placeholder="Acme Corp"]', 'Acme Updated')
    await page.click('button:has-text("Update Customer")')

    await expect(page.locator('text=Acme Updated')).toBeVisible()
  })
})
