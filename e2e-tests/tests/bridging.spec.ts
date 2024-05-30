import { test, expect } from '../fixture/synpress'
import * as metamask from '@synthetixio/synpress/commands/metamask'

test.beforeEach(async ({ page }) => {
  await page.goto('/bridge')
  page.on('console', (msg) => console.log(msg.text()))
})

test.describe('Gateway Bridging - ETHEREUM', () => {
  test('Should Deposit ETH Successfully', async ({ page }) => {
    test.setTimeout(120000)

    await page.getByTestId('setting-btn').click()

    expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    expect(page.getByText('Show Testnets')).toBeVisible()

    const inputElement = page
      .locator('label[data-testid="switch-label"] input[type="checkbox"]')
      .first()

    const isChecked = await inputElement.isChecked()

    expect(isChecked).toBe(false)

    await inputElement.dispatchEvent('click')

    await page.waitForTimeout(500)

    const updatedIsChecked = await inputElement.isChecked()

    expect(updatedIsChecked).toBe(true)

    await page.getByTestId('close-modal-settings-modal').click()

    await page.getByTestId('connect-btn').click()

    await page.getByTestId('metamask-link').click()

    await metamask.acceptAccess()

    await page.getByTestId('connect-btn').click()

    await expect(page.getByTestId('label-address')).toContainText('7428')

    await expect(page.getByTestId('connect-btn')).not.toBeVisible()

    await page.waitForTimeout(1000)

    // open token picker.
    await page.locator('#tokenSelectorInput').click()

    // select token symbol eth.
    await page
      .locator('div[title="tokenList"]')
      .getByTestId('token-ETH')
      .click()

    const bridgeBtn = page.getByTestId('bridge-btn')

    await expect(bridgeBtn).toBeDisabled()

    // enter amount.
    await page.locator('input#bridgeAmount').fill('0.0001')

    await expect(bridgeBtn).not.toBeDisabled()

    await bridgeBtn.click()
    // validate bridging fee sections.
    await expect(page.getByTestId('amountToRecieve')).toHaveText('0.0001 ETH')

    const estTime = await page
      .locator(':text("Estimated time") + p')
      .textContent()

    expect(estTime).toBe('13 ~ 14mins.')

    const estRecievable = await page
      .locator(':text("You will receive") + p')
      .textContent()

    expect(estRecievable).toBe('0.0001 ETH')

    // validate bridge confirmation modal.
    await expect(
      page.getByRole('heading', { name: 'Bridge Confirmation' })
    ).toBeVisible()

    await expect(page.getByTestId('fromNetwork')).toContainText(
      'Ethereum (Sepolia)'
    )

    await expect(page.getByTestId('toNetwork')).toContainText('Boba (Sepolia)')

    await page.locator('button:text("Confirm")').click()

    await expect(
      page.getByRole('heading', { name: 'Bridging...' })
    ).toBeVisible()

    // for deposit
    await metamask.confirmPermissionToSpend('0.0001', true)

    await expect(page.getByTestId('transactionSuccess-modal')).toBeVisible({
      timeout: 60000,
    })

    await expect(page.getByTestId('success')).toHaveText('Successful')

    await page.getByRole('button', { name: 'Go to history' }).click()

    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible()
  })

  test('Should Deposit BOBA Successfully', async ({ page }) => {
    test.setTimeout(150000)

    await page.getByTestId('setting-btn').click()

    expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()

    expect(page.getByText('Show Testnets')).toBeVisible()

    const inputElement = page
      .locator('label[data-testid="switch-label"] input[type="checkbox"]')
      .first()

    const isChecked = await inputElement.isChecked()

    expect(isChecked).toBe(false)

    await inputElement.dispatchEvent('click')

    await page.waitForTimeout(500)

    const updatedIsChecked = await inputElement.isChecked()

    expect(updatedIsChecked).toBe(true)

    await page.getByTestId('close-modal-settings-modal').click()

    await page.getByTestId('connect-btn').click()

    await page.getByTestId('metamask-link').click()

    await metamask.acceptAccess()

    await page.getByTestId('connect-btn').click()

    await expect(page.getByTestId('label-address')).toContainText('7428')

    await expect(page.getByTestId('connect-btn')).not.toBeVisible()

    await page.waitForTimeout(1000)

    // open token picker.
    await page.locator('#tokenSelectorInput').click()

    // select token symbol BOBA.
    await page
      .locator('div[title="tokenList"]')
      .getByTestId('token-BOBA')
      .click()

    const bridgeBtn = page.getByTestId('bridge-btn')

    await expect(bridgeBtn).toBeDisabled()

    // enter amount.
    await page.locator('input#bridgeAmount').fill('0.0001')

    await expect(bridgeBtn).not.toBeDisabled()

    await bridgeBtn.click()
    // validate bridging fee sections.
    await expect(page.getByTestId('amountToRecieve')).toHaveText('0.0001 BOBA')

    const estTime = await page
      .locator(':text("Estimated time") + p')
      .textContent()

    expect(estTime).toBe('13 ~ 14mins.')

    const estRecievable = await page
      .locator(':text("You will receive") + p')
      .textContent()

    expect(estRecievable).toBe('0.0001 BOBA')

    // validate bridge confirmation modal.
    await expect(
      page.getByRole('heading', { name: 'Bridge Confirmation' })
    ).toBeVisible()

    await expect(page.getByTestId('fromNetwork')).toContainText(
      'Ethereum (Sepolia)'
    )

    await expect(page.getByTestId('toNetwork')).toContainText('Boba (Sepolia)')

    await page.locator('button:text("Confirm")').click()

    await expect(
      page.getByRole('heading', { name: 'Bridging...' })
    ).toBeVisible()

    // for deposit
    await metamask.confirmPermissionToSpend('0.0001', true)

    await expect(page.getByTestId('transactionSuccess-modal')).toBeVisible({
      timeout: 60000,
    })

    await expect(page.getByTestId('success')).toHaveText('Successful')

    await page.getByRole('button', { name: 'Go to history' }).click()

    await expect(page.getByRole('heading', { name: 'History' })).toBeVisible()
  })
})
