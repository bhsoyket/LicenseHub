import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', 'john@licensehub.io')
  await page.fill('#password', 'password')
  await page.click('button:has-text("Sign In")')
  await expect(page).toHaveURL(/\/dashboard/)
})

test.describe('Licenses', () => {
  test('lists licenses', async ({ page }) => {
    await page.goto('/licenses')
    await expect(page.locator('text=LIC-ERP-A1B2-2026').first()).toBeVisible()
    await expect(page.locator('text=LIC-POS-E5F6-2026').first()).toBeVisible()
  })

  test('creates a license', async ({ page }) => {
    await page.goto('/licenses')
    await page.click('button:has-text("Generate License")')

    const selects = page.locator('.fixed.inset-0.z-50 select')
    await selects.nth(0).selectOption('prod_1')
    await page.waitForTimeout(300)
    await selects.nth(1).selectOption('cust_1')
    await selects.nth(2).selectOption('pkg_3')

    await page.locator('.fixed.inset-0.z-50 button:has-text("Generate License")').click()

    await expect(page.locator('text=License generated successfully')).toBeVisible()
  })

  test('views license detail', async ({ page }) => {
    await page.goto('/licenses')
    await page.locator('svg.lucide-eye').first().click()
    await expect(page).toHaveURL(/\/licenses\/lic_1/)
    await expect(page.locator('text=Acme Corporation').first()).toBeVisible()
  })

  test('shows Pay Now button on license detail', async ({ page }) => {
    await page.goto('/licenses/lic_1')
    await expect(page.locator('button:has-text("Pay Now")')).toBeVisible()
  })

  test('renews a license', async ({ page }) => {
    await page.goto('/licenses')
    await page.locator('svg.lucide-refresh-cw').first().click()
    await page.locator('.fixed.inset-0.z-50 button:has-text("renew")').click()
    await expect(page.locator('text=License renewed successfully')).toBeVisible()
  })
})
