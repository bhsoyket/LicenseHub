import { test, expect } from '@playwright/test'

test.describe('Payment Flow', () => {
  test('payment page loads with package selection', async ({ page }) => {
    await page.goto('/pay/lic_1')
    await expect(page.locator('text=Select a Package')).toBeVisible()
    await expect(page.locator('text=Current').first()).toBeVisible()
  })

  test('selects a different package and proceeds to payment step', async ({ page }) => {
    await page.goto('/pay/lic_1')
    await page.locator('button.rounded-xl').nth(1).click()
    await page.click('button:has-text("Next")')
    await expect(page.locator('text=Pay with Card')).toBeVisible()
  })

  test('completes card payment successfully', async ({ page }) => {
    await page.goto('/pay/lic_1')
    await page.locator('button.rounded-xl').first().click()
    await page.click('button:has-text("Next")')
    await expect(page.locator('text=Pay with Card')).toBeVisible()

    await page.fill('input[placeholder="John Doe"]', 'Test User')
    await page.fill('input[placeholder="4242 4242 4242 4242"]', '4242424242424242')
    await page.fill('input[placeholder="MM/YY"]', '12/28')
    await page.fill('input[placeholder="123"]', '123')

    // Click the submit button that contains "USD"
    await page.locator('button:has-text("Pay")').last().click()

    await expect(page.locator('text=Payment Successful')).toBeVisible({ timeout: 10000 })
  })

  test('submits custom payment for approval', async ({ page }) => {
    await page.goto('/pay/lic_1')
    await page.locator('button.rounded-xl').first().click()
    await page.click('button:has-text("Next")')

    await page.click('button:has-text("Custom Payment")')

    await page.fill('input[placeholder="John Doe"]', 'Test User')
    await page.fill('input[placeholder="TXN-123456789"]', 'TXN-TEST-001')
    await page.click('button:has-text("Submit Payment")')

    await expect(page.locator('text=Payment Submitted')).toBeVisible({ timeout: 10000 })
  })

  test('back button respects redirect param', async ({ page }) => {
    // Login first so /licenses doesn't redirect to /login
    await page.goto('/login')
    await page.fill('#email', 'john@licensehub.io')
    await page.fill('#password', 'password')
    await page.click('button:has-text("Sign In")')
    await expect(page).toHaveURL(/\/dashboard/)

    await page.goto('/pay/lic_1?redirect=/licenses')
    await page.click('button:has-text("Back")')
    await expect(page).toHaveURL(/\/licenses$/)
  })
})
