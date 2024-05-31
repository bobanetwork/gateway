import { expect, Page } from '@playwright/test'
import * as metamask from '@synthetixio/synpress/commands/metamask'
import { BasePage } from './basePage'

export class BridgePage extends BasePage {
  constructor(public page: Page) {
    super(page)
  }

  // token picker.
  // minimal assertion write more to validate other things.
  // tokenSymbol - BOBA ETH DADO
  async openTokenPickerAndSelect(tokenSymbol: string) {
    await this.page.locator('#tokenSelectorInput').click()
    await expect(this.page.getByText('Select Token')).toBeVisible()
    await this.page
      .locator('div[title="tokenList"]')
      .getByTestId(`token-${tokenSymbol}`)
      .click()
  }

  async bridgeButtonDisable() {
    const bridgeBtn = this.page.getByTestId('bridge-btn')
    await expect(bridgeBtn).toBeDisabled()
  }

  async bridgeButtonEnable() {
    const bridgeBtn = this.page.getByTestId('bridge-btn')
    await expect(bridgeBtn).toBeEnabled()
  }

  async validateBridgingFee(amount: string, token: string) {
    await expect(this.page.getByTestId('amountToRecieve')).toHaveText(
      `${amount} ${token}`
    )

    const estTime = await this.page
      .locator(':text("Estimated time") + p')
      .textContent()

    expect(estTime).toBe('13 ~ 14mins.')

    const estRecievable = await this.page
      .locator(':text("You will receive") + p')
      .textContent()

    // TODO: update value with fee calculation.
    expect(estRecievable).toBe(`${amount} ${token}`)
  }

  async clickToBridge() {
    await this.page.getByTestId('bridge-btn').click()
  }

  async inputBridgeAmount(amount: string) {
    await this.page.locator('input#bridgeAmount').fill(amount)
  }

  async validateAndConfirmBridging(amount: string, token: string) {
    await expect(
      this.page.getByRole('heading', { name: 'Bridge Confirmation' })
    ).toBeVisible()

    // label can change base on networkType.
    await expect(this.page.getByTestId('fromNetwork')).toContainText(
      'Ethereum (Sepolia)'
    )

    await expect(this.page.getByTestId('toNetwork')).toContainText(
      'Boba (Sepolia)'
    )

    const amountToBridge = await this.page
      .locator(':text("Amount to bridge") + p')
      .textContent()

    await expect(amountToBridge).toContain(`${amount} ${token}`)

    const time = await this.page
      .locator('[data-testid="bridge-confirmation"] :text("Time") + p')
      .textContent()

    expect(time).toBe('13 ~ 14mins.')

    await this.page.locator('button:text("Confirm")').click()
  }

  async confirmMetaMaskModalToBridge(amount: string) {
    await expect(
      this.page.getByRole('heading', { name: 'Bridging...' })
    ).toBeVisible()

    // for deposit
    await metamask.confirmPermissionToSpend(amount, true)

    await expect(this.page.getByTestId('transactionSuccess-modal')).toBeVisible(
      {
        timeout: 60000,
      }
    )
  }

  async validateBridgeSuccess() {
    await expect(this.page.getByTestId('success')).toHaveText('Successful')
  }

  async toHistoryPage() {
    await this.page.getByRole('button', { name: 'Go to history' }).click()

    await expect(
      this.page.getByRole('heading', { name: 'History' })
    ).toBeVisible()
  }
}
