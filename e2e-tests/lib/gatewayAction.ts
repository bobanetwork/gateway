import { Page } from '@playwright/test'
import { BasePage } from '../pages/basePage'
import { BridgePage } from '../pages/bridgePage'

export class GatewayAction {
  constructor(public page: Page) {}

  async classicBridgeDeposit({
    amountToBridge,
    tokenSymbol,
    successWaitTime = 1000,
  }: {
    amountToBridge: string
    tokenSymbol: string
    successWaitTime?: number
  }) {
    const bridgePage = new BridgePage(this.page)
    await bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await bridgePage.bridgeButtonDisable()
    await bridgePage.inputBridgeAmount(amountToBridge)
    await bridgePage.bridgeButtonEnable()
    await bridgePage.validateBridgingFee(amountToBridge, tokenSymbol)
    await bridgePage.clickToBridge()
    await bridgePage.validateAndConfirmBridging(amountToBridge, tokenSymbol)
    await bridgePage.confirmMetaMaskModalToBridge(amountToBridge)
    await bridgePage.wait(successWaitTime) // have to wait for success modal
    await bridgePage.validateBridgeSuccess()
    await bridgePage.toHistoryPage()
  }

  async connectToTestnet() {
    const basePage = new BasePage(this.page)
    await basePage.openAndValidateSettingsModal()
    await basePage.switchToTestnet()
    await basePage.connectToMetamask()
    await basePage.wait(1000)
  }
}
