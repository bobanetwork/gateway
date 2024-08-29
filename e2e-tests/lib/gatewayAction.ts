import { Page } from '@playwright/test'
import { BasePage } from '../pages/basePage'
import { BridgePage } from '../pages/bridgePage'

export class GatewayAction {
  basePage: BasePage
  bridgePage: BridgePage

  constructor(public page: Page) {
    this.basePage = new BasePage(page)
    this.bridgePage = new BridgePage(page)
  }

  async classicBridge({
    amountToBridge,
    tokenSymbol,
    estimatedTime = '',
  }: {
    amountToBridge: string
    tokenSymbol: string
    estimatedTime?: string
  }) {
    await this.basePage.disconnectMetamask()
    await this.basePage.connectToMetamask(true)
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonToBeDisable()
    await this.bridgePage.fillBridgingAmount(amountToBridge)
    await this.bridgePage.bridgeButtonToBeEnable()
    await this.bridgePage.validateBridgingFee({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime,
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime,
    })
  }

  async doDepositClassicBridge({
    amountToBridge,
    approveAllowance = false,
  }: {
    amountToBridge: string
    approveAllowance?: boolean
  }) {
    if (approveAllowance) {
      await this.bridgePage.approveAndConfirmMetaMaskSuccess(amountToBridge)
    } else {
      await this.bridgePage.confirmMetaMaskModalToBridge(amountToBridge)
    }
    await this.bridgePage.wait(1000)
    await this.bridgePage.validateBridgeSuccess()
    await this.bridgePage.toHistoryPage()
  }

  async doWithdrawClassicBridge() {
    await this.bridgePage.reviewAndWithdraw()
  }

  async lightBridge({
    amountToBridge,
    tokenSymbol,
    successWaitTime = 1000,
    approveAllowance = false,
    receivableAmt,
  }: {
    amountToBridge: string
    tokenSymbol: string
    receivableAmt?: string
    successWaitTime?: number
    approveAllowance?: boolean
  }) {
    await this.bridgePage.switchToLightBridge()
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonToBeDisable()
    await this.bridgePage.fillBridgingAmount(amountToBridge)
    await this.bridgePage.bridgeButtonToBeEnable()
    await this.bridgePage.validateBridgingFee({
      amount: receivableAmt ? Number(receivableAmt).toFixed(4) : amountToBridge,
      token: tokenSymbol,
      estimatedTime: '~1min.',
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime: '~1min.',
    })
    if (approveAllowance) {
      await this.bridgePage.approveAndConfirmMetaMaskSuccess(amountToBridge)
    } else {
      await this.bridgePage.confirmMetaMaskModalToBridge(amountToBridge)
    }
    await this.bridgePage.wait(successWaitTime) // have to wait for success modal
    await this.bridgePage.validateBridgeSuccess()
    await this.bridgePage.toHistoryPage()
  }

  async connectToTestnet() {
    await this.basePage.openAndValidateSettingsModal()
    await this.basePage.switchToTestnet()
    await this.basePage.connectToMetamask()
    await this.basePage.wait(1000)
  }

  async switchToL2AndReset() {
    await this.basePage.clickToSwitchNetwork()
    await this.basePage.disconnectMetamask()
    await this.basePage.connectToMetamask(true)
  }

  async addAndConnectBNBTestnet() {
    await this.connectToTestnet()
    await this.basePage.clickAndSwitchToBnb()
    await this.basePage.wait(1000)
  }
}
