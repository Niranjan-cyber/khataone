import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const key = (page: Page, k: string) => page.locator('.key', { hasText: new RegExp(`^${k}$`) }).click()
const total = (page: Page) => page.locator('#baaki-h + span').getAttribute('data-value')

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.goto('/#/')
})

test('adds ₹250 udhaar to a recent customer in three taps, then undo restores the balance', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await expect.poll(() => total(page)).toBe('₹10,750')
  await page.getByRole('button', { name: /Add udhaar: Suresh Patil/ }).click()
  for (const k of ['2', '5', '0']) await key(page, k)
  await expect(page.getByTestId('after')).toHaveText('₹1,250')
  const save = page.getByTestId('save')
  await expect(save).toHaveText('Save ₹250 udhaar')
  await save.click()
  await expect(page.getByRole('status').getByText('₹250 udhaar written for Suresh Patil')).toBeVisible()
  await expect.poll(() => total(page)).toBe('₹11,000')
  await page.getByRole('button', { name: 'Undo' }).click()
  await expect.poll(() => total(page)).toBe('₹10,750')
  expect(errors).toEqual([])
})

test('double-tapping save writes one entry', async ({ page }) => {
  await page.goto('/#/entry/udhaar/c3')
  for (const k of ['1', '3', '7']) await key(page, k)
  await page.getByTestId('save').dblclick({ force: true })
  await page.goto('/#/ledger/c3')
  await expect(page.locator('.lrow', { hasText: '+₹137' })).toHaveCount(1)
})

test('zero amount cannot be saved', async ({ page }) => {
  await page.goto('/#/entry/udhaar/c1')
  await expect(page.getByTestId('save')).toBeDisabled()
  await key(page, '0')
  await expect(page.getByTestId('save')).toBeDisabled()
})

test('search, create a new customer, add udhaar, persists after reload', async ({ page }) => {
  await page.getByTestId('add-udhaar').click()
  await page.getByRole('textbox', { name: 'Search name or phone' }).fill('Deepak')
  await page.getByRole('button', { name: 'Add "Deepak" as a new customer' }).click()
  await page.getByRole('button', { name: 'Save and continue' }).click()
  for (const k of ['5', '0', '0']) await key(page, k)
  await page.getByTestId('save').click()
  await page.reload()
  await expect(page.getByRole('button', { name: /Add udhaar: Deepak, Baaki ₹500/ })).toBeVisible()
})

test('partial then full repayment via UPI simulation and cash', async ({ page }) => {
  await page.goto('/#/collect/c1')
  await page.getByPlaceholder('Part payment').fill('400')
  await page.getByRole('button', { name: 'Fail' }).click()
  await expect(page.getByText('Payment failed')).toBeVisible()
  await page.getByRole('button', { name: 'Try again' }).click()
  await page.getByRole('button', { name: 'Success' }).click()
  await expect(page.getByText('Payment received')).toBeVisible()
  await expect(page.getByText('Baaki after this: ₹600')).toBeVisible()
  await page.getByRole('button', { name: 'Done' }).click()
  await page.goto('/#/ledger/c1')
  await page.getByRole('button', { name: 'Collect' }).click()
  await page.getByRole('button', { name: 'Cash received' }).click()
  await page.goto('/#/ledger/c1')
  await expect(page.locator('header [data-value]')).toHaveAttribute('data-value', '₹0')
})

test('cancelling a wrong entry corrects the balance and keeps it visible', async ({ page }) => {
  await page.goto('/#/ledger/c1')
  await page.locator('.lrow').first().click()
  await page.getByRole('button', { name: 'This entry is wrong: cancel it' }).click()
  await expect(page.locator('header [data-value]')).toHaveAttribute('data-value', '₹750')
  await expect(page.locator('.lrow.is-void')).toHaveCount(1)
})

test('reminder switches language and states that nothing is sent automatically', async ({ page }) => {
  await page.goto('/#/remind/c1')
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.locator('.bubble')).toContainText('Namaste Suresh ji')
  await expect(page.locator('.bubble')).toContainText('Please pay whenever convenient')
  await page.getByRole('button', { name: 'मराठी' }).click()
  await expect(page.locator('.bubble')).toContainText('नमस्कार Suresh जी')
  await expect(page.getByText(/Nothing is sent until you press send/)).toBeVisible()
})

for (const path of ['/#/', '/#/pick/udhaar', '/#/entry/udhaar/c1', '/#/ledger/c1', '/#/remind/c1', '/#/collect/c1']) {
  test(`no serious accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForTimeout(400)
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)).toEqual([])
  })
}
