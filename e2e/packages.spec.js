import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', 'john@licensehub.io')
  await page.fill('#password', 'password')
  await page.click('button:has-text("Sign In")')
  await expect(page).toHaveURL(/\/dashboard/)
})

test.describe('Packages', () => {
  test('lists packages grouped by product', async ({ page }) => {
    await page.goto('/packages')
    await expect(page.locator('text=Enterprise ERP').first()).toBeVisible()
    await expect(page.locator('text=CloudPOS').first()).toBeVisible()
    await expect(page.locator('text=Free Trial').first()).toBeVisible()
    await expect(page.locator('text=Standard').first()).toBeVisible()
  })

  test('shows package details with pricing', async ({ page }) => {
    await page.goto('/packages')
    await expect(page.locator('text=$299').first()).toBeVisible()
    await expect(page.locator('text=$2990').first()).toBeVisible()
  })
})
