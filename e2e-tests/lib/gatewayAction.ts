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

  async classicBridgeDeposit({
    amountToBridge,
    tokenSymbol,
    successWaitTime = 1000,
  }: {
    amountToBridge: string
    tokenSymbol: string
    successWaitTime?: number
  }) {
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonDisable()
    await this.bridgePage.inputBridgeAmount(amountToBridge)
    await this.bridgePage.bridgeButtonEnable()
    await this.bridgePage.validateBridgingFee({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime: '13 ~ 14mins.',
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      fromNetwork: 'Ethereum (Sepolia)',
      toNetwork: 'Boba (Sepolia)',
      estimatedTime: '13 ~ 14mins.',
    })
    await this.bridgePage.confirmMetaMaskModalToBridge(amountToBridge)
    await this.bridgePage.wait(successWaitTime) // have to wait for success modal
    await this.bridgePage.validateBridgeSuccess()
    await this.bridgePage.toHistoryPage()
  }

  async classicBridgeWithdrawal({
    amountToBridge,
    tokenSymbol,
  }: {
    amountToBridge: string
    tokenSymbol: string
  }) {
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonDisable()
    await this.bridgePage.inputBridgeAmount(amountToBridge)
    await this.bridgePage.bridgeButtonEnable()
    await this.bridgePage.validateBridgingFee({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime: '7 days',
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      fromNetwork: 'Boba (Sepolia)',
      toNetwork: 'Ethereum (Sepolia)',
      estimatedTime: '7 days',
    })
    await this.bridgePage.reviewAndInitiateWithdrawal()
    // TODO :
    // await this.bridgePage.switchNetworkProovWithdrawal()
    // NOTE: Discuss and implement the proove validation.
  }

  async lightBridgeDeposit({
    amountToBridge,
    tokenSymbol,
    successWaitTime = 1000,
  }: {
    amountToBridge: string
    tokenSymbol: string
    successWaitTime?: number
  }) {
    await this.bridgePage.switchToLightBridge()
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonDisable()
    await this.bridgePage.inputBridgeAmount(amountToBridge)
    await this.bridgePage.bridgeButtonEnable()
    await this.bridgePage.validateBridgingFee({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime: '~1min.',
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      fromNetwork: 'Ethereum (Sepolia)',
      toNetwork: 'Boba (Sepolia)',
      estimatedTime: '',
    })
    await this.bridgePage.confirmMetaMaskModalToBridge(amountToBridge)
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

  async switchNetwork() {
    await this.basePage.clickToSwitchNetwork()
  }
}