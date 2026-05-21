import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('logs in with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', 'john@licensehub.io')
    await page.fill('#password', 'password')
    await page.click('button:has-text("Sign In")')
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('text=Welcome back')).toBeVisible()
  })

  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', 'wrong@email.com')
    await page.fill('#password', 'wrongpass')
    await page.click('button:has-text("Sign In")')
    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })

  test('navigates to register from login', async ({ page }) => {
    await page.goto('/login')
    await page.click('text=Create account')
    await expect(page).toHaveURL(/\/register/)
  })

  test('navigates to reset password from login', async ({ page }) => {
    await page.goto('/login')
    await page.click('text=Forgot password?')
    await expect(page).toHaveURL(/\/reset-password/)
  })

  test('logs out successfully', async ({ page }) => {
    await page.goto('/login')
    await page.fill('#email', 'john@licensehub.io')
    await page.fill('#password', 'password')
    await page.click('button:has-text("Sign In")')
    await expect(page).toHaveURL(/\/dashboard/)

    // Click user avatar (initials "JD") to open dropdown, then click Sign Out
    await page.locator('button:has-text("JD")').click()
    await page.click('text=Sign Out')
    await expect(page).toHaveURL(/\/login/)
  })
})
