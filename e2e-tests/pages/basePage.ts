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
  async connectToMetamask() {
    await this.page.getByTestId('connect-btn').click()

    await this.page.getByTestId('metamask-link').click()

    await metamask.acceptAccess()

    await this.page.getByTestId('connect-btn').click()

    await expect(this.page.getByTestId('label-address')).toContainText('7428')

    await expect(this.page.getByTestId('connect-btn')).not.toBeVisible()
  }

  async clickToSwitchNetwork() {
    await this.page.getByTestId('switchNetwork').click()

    await metamask.allowToAddAndSwitchNetwork()
  }
  // disconnect
}
