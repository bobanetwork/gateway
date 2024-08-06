import { expect, Page } from '@playwright/test'
import * as metamask from '@synthetixio/synpress/commands/metamask'
import { BasePage } from './basePage'

export class BridgePage extends BasePage {
  constructor(public page: Page) {
    super(page)
  }

  async openTokenPickerAndSelect(tokenSymbol: string) {
    await this.page.locator('#tokenSelectorInput').click()
    await expect(this.page.getByText('Select Token')).toBeVisible()
    await this.page.waitForTimeout(4000)
    await this.page
      .locator('div[title="tokenList"]')
      .getByTestId(`token-${tokenSymbol}`)
      .click()
  }

  async switchToLightBridge() {
    await this.page.getByTestId('light-btn').click()
  }

  async bridgeButtonToBeDisable() {
    const bridgeBtn = this.page.getByTestId('bridge-btn')
    await expect(bridgeBtn).toBeDisabled()
  }

  async bridgeButtonToBeEnable() {
    const bridgeBtn = this.page.getByTestId('bridge-btn')
    await expect(bridgeBtn).toBeEnabled()
  }

  async validateBridgingFee({
    amount,
    token,
    estimatedTime,
  }: {
    amount: string
    token: string
    estimatedTime: string
  }) {
    await expect(this.page.getByTestId('amountToRecieve')).toHaveText(
      `${parseFloat(Number(amount).toFixed(4))} ${token}`
    )

    const estTime = await this.page
      .locator(':text("Estimated time") + p')
      .textContent()

    expect(estTime).toBe(estimatedTime)

    const estRecievable = await this.page
      .locator(':text("You will receive") + p')
      .textContent()

    // TODO: update value with fee calculation.
    expect(estRecievable).toBe(
      `${parseFloat(Number(amount).toFixed(4))} ${token}`
    )
  }

  async clickToBridge() {
    await this.page.getByTestId('bridge-btn').click()
  }

  async fillBridgingAmount(amount: string) {
    await this.page.locator('input#bridgeAmount').fill(amount)
  }

  async validateAndConfirmBridging({
    amount,
    token,
    fromNetwork,
    toNetwork,
    estimatedTime,
  }: {
    amount: string
    token: string
    fromNetwork: string
    toNetwork: string
    estimatedTime: string
  }) {
    await expect(
      this.page.getByRole('heading', { name: 'Bridge Confirmation' })
    ).toBeVisible()

    // label can change base on networkType.
    await expect(this.page.getByTestId('fromNetwork')).toContainText(
      fromNetwork //'Ethereum (Sepolia)'
    )

    await expect(this.page.getByTestId('toNetwork')).toContainText(
      toNetwork //'Boba (Sepolia)'
    )

    const amountToBridge = await this.page
      .locator(':text("Amount to bridge") + p')
      .textContent()

    await expect(amountToBridge).toContain(`${amount} ${token}`)

    const time = await this.page
      .locator('[data-testid="bridge-confirmation"] :text("Time") + p')
      .textContent()

    expect(time).toBe(estimatedTime)

    await this.page.getByRole('button', { name: 'Confirm' }).click()
  }

  async confirmMetaMaskModalToBridge(amount: string) {
    await expect(
      this.page.getByRole('heading', { name: 'Bridging...' })
    ).toBeVisible()

    await metamask.confirmPermissionToSpend(amount, true)

    await expect(this.page.getByTestId('transactionSuccess-modal')).toBeVisible(
      { timeout: 60000 }
    )
  }

  async approveAndConfirmMetaMaskSuccess(amount: string) {
    await expect(
      this.page.getByRole('heading', { name: 'Bridging...' })
    ).toBeVisible()

    await metamask.confirmPermissionToSpend(amount, true)

    this.page.waitForTimeout(3000) // wait for 3 secs.

    await metamask.confirmTransaction({ shouldWaitForPopupClosure: true })

    await expect(this.page.getByTestId('transactionSuccess-modal')).toBeVisible(
      { timeout: 60000 }
    )
  }

  async validateBridgeSuccess() {
    await expect(this.page.getByTestId('success')).toHaveText('Successful')
  }

  async toHistoryPage() {
    await this.page.getByRole('button', { name: 'Go to history' }).click()

    await this.page.waitForTimeout(1000)

    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText(
      'History'
    )
  }

  async reviewAndInitiateWithdrawal() {
    await expect(
      this.page.getByRole('heading', { name: 'Withdrawal' })
    ).toBeVisible()

    const initBtn = this.page.getByRole('button', {
      name: 'Initiate Withdrawal',
    })

    await expect(initBtn).toBeEnabled()

    await initBtn.click()

    await metamask.confirmTransaction()

    await this.wait(2000)

    await this.page.getByRole('button', { name: 'Close' }).click()
  }

  async switchNetworkProovWithdrawal() {
    const switchBtn = this.page.getByRole('button', { name: 'Switch Network' })

    await expect(switchBtn).toBeEnabled()

    await switchBtn.click()

    await expect(switchBtn).toBeDisabled()

    await metamask.allowToAddAndSwitchNetwork()

    // close prove withdrawal modal.
    await this.page.getByRole('button', { name: 'Close' }).click()
  }

  async confirmErrorAlert({ error }: { error: string }) {
    expect(await this.page.isVisible('#bridge [type="error"]')).toBeTruthy()
    const text = await this.page
      .locator('#bridge [type="error"] p')
      .textContent()
    expect(text).toEqual(error)
  }
}
