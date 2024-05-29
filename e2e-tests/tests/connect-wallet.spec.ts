import { test, expect } from '../fixture/synpress'
import * as metamask from '@synthetixio/synpress/commands/metamask'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  page.on('console', (msg) => console.log(msg.text()))
})

test.describe('Connect to MM', () => {
  test('Validate Deposit', async ({ page }) => {
    await page.getByTestId('setting-btn').click()
    expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    expect(page.getByText('Show Testnets')).toBeVisible()

    const inputElement = await page
      .locator('label[data-testid="switch-label"] input[type="checkbox"]')
      .first()

    const isChecked = await inputElement.isChecked()

    expect(isChecked).toBe(false)

    // trigger checked.
    await inputElement.dispatchEvent('click')

    const updatedIsChecked = await inputElement.isChecked()

    expect(updatedIsChecked).toBe(true)

    await page.getByTestId('close-modal-settings-modal').click()

    // trigger connect.
    await page.getByTestId('connect-btn').click()
    // await page.locator('#switchBridgeDirection').click()

    await page.getByTestId('metamask-link').click()

    await metamask.acceptAccess()

    await page.getByTestId('connect-btn').click()

    await expect(page.getByTestId('label-address')).toContainText('7428')

    await expect(page.getByTestId('connect-btn')).not.toBeVisible()
  })
})
