import { expect, Page } from '@playwright/test'
import * as metamask from '@synthetixio/synpress/commands/metamask'

export class BasePage {
  constructor(public page: Page) {}

  // wait - accept time in milliseconds.
  async wait(millisec: number) {
    this.page.waitForTimeout(millisec || 500)
  }

  // navigation
  // settings
  async openAndValidateSettingsModal() {
    await this.page.getByTestId('setting-btn').click()

    await expect(
      this.page.getByRole('heading', { name: 'Settings' })
    ).toBeVisible()

    await expect(this.page.getByText('Show Testnets')).toBeVisible()

    await expect(this.page.getByText('Add Destination Address')).toBeVisible()
  }

  async switchToTestnet() {
    const inputElement = this.page
      .locator('label[data-testid="switch-label"] input[type="checkbox"]')
      .first()

    const isChecked = await inputElement.isChecked()

    expect(isChecked).toBe(false)

    await inputElement.dispatchEvent('click')

    await this.page.waitForTimeout(500)

    const updatedIsChecked = await inputElement.isChecked()

    expect(updatedIsChecked).toBe(true)

    this.closeSettingModal()
  }

  async switchToMainnet() {
    const inputElement = this.page
      .locator('label[data-testid="switch-label"] input[type="checkbox"]')
      .first()

    const isChecked = await inputElement.isChecked()

    expect(isChecked).toBe(true)

    await inputElement.dispatchEvent('click')

    await this.page.waitForTimeout(500)

    const updatedIsChecked = await inputElement.isChecked()

    expect(updatedIsChecked).toBe(false)

    this.closeSettingModal()
  }

  async closeSettingModal() {
    await this.page.getByTestId('close-modal-settings-modal').click()
  }

  // connect
  // first time connect to meta mask.
  async connectToMetamask(firstConnect = false) {
    await this.page.getByTestId('connect-btn').click()

    await this.page.getByTestId('metamask-link').click()

    if (firstConnect) {
      return
    }

    await metamask.acceptAccess()

    // NOTE: need to get the spec running on locall.
    if (!process.env.CI) {
      await this.page.getByTestId('connect-btn').click()
    }

    await this.page.waitForTimeout(2000)

    await expect(this.page.getByTestId('label-address')).toContainText('7428')

    await expect(this.page.getByTestId('connect-btn')).not.toBeVisible()
  }

  async clickToSwitchNetwork() {
    await this.page.getByTestId('switchNetwork').click()

    await metamask.allowToAddAndSwitchNetwork()
  }

  async clickAndSwitchToBnb() {
    await this.page.getByTestId('from-network-picker').click()
    await expect(
      this.page.getByRole('heading', { level: 2, name: 'Select Network' })
    ).toBeVisible()

    await expect(this.page.getByText('Network Names')).toBeVisible()

    await this.page.getByTestId('selector-bnb').click()

    await this.page.waitForTimeout(1000)

    await this.page.getByTestId('switch-network-btn').click()

    await this.page.waitForTimeout(2000)

    await this.page.getByText('Connect to the Bnb Testnet network').click()

    await metamask.allowToAddAndSwitchNetwork()
  }

  // disconnect
  async disconnectMetamask() {
    await this.page.getByTestId('label-address').click()
    await this.page.getByText('Disconnect').click()
    await this.wait(2000)
  }
}
