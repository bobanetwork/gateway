import { Page } from '@playwright/test'
import { BasePage } from '../pages/basePage'
import { BridgePage } from '../pages/bridgePage'

const networkConfig = {
  L1: {
    token: 'ETH',
    chainId: '11155111',
    name: 'Sepolia',
  },
  L2: {
    token: 'ETH',
    chainId: '28882',
    name: 'Boba Sepolia',
  },
}

const networkNames = {
  eth: {
    fromNetwork: 'Ethereum (Sepolia)',
    toNetwork: 'Boba (Sepolia)',
  },
  bnb: {
    fromNetwork: 'BNB Testnet',
    toNetwork: 'Boba BNB Testnet',
  },
}

const withDrawalNetworkNames = {
  eth: {
    toNetwork: 'Ethereum (Sepolia)',
    fromNetwork: 'Boba (Sepolia)',
  },
  bnb: {
    toNetwork: 'BNB Testnet',
    fromNetwork: 'Boba BNB Testnet',
  },
}

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
    approveAllowance = false,
    networkKey = 'eth',
  }: {
    amountToBridge: string
    tokenSymbol: string
    successWaitTime?: number
    approveAllowance?: boolean
    networkKey?: 'bnb' | 'eth'
  }) {
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonToBeDisable()
    await this.bridgePage.fillBridgingAmount(amountToBridge)
    await this.bridgePage.bridgeButtonToBeEnable()
    await this.bridgePage.validateBridgingFee({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime: '13 ~ 14mins.',
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      ...networkNames[networkKey],
      estimatedTime: '13 ~ 14mins.',
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

  async classicBridgeWithdrawal({
    amountToBridge,
    tokenSymbol,
    networkKey = 'eth',
  }: {
    amountToBridge: string
    tokenSymbol: string
    networkKey?: 'bnb' | 'eth'
  }) {
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonToBeDisable()
    await this.bridgePage.fillBridgingAmount(amountToBridge)
    await this.bridgePage.bridgeButtonToBeEnable()
    await this.bridgePage.validateBridgingFee({
      amount: amountToBridge,
      token: tokenSymbol,
      estimatedTime: '7 days',
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      ...withDrawalNetworkNames[networkKey],
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
    approveAllowance = false,
  }: {
    amountToBridge: string
    tokenSymbol: string
    successWaitTime?: number
    approveAllowance?: boolean
  }) {
    await this.bridgePage.switchToLightBridge()
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonToBeDisable()
    await this.bridgePage.fillBridgingAmount(amountToBridge)
    await this.bridgePage.bridgeButtonToBeEnable()
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

  async lightBridgeWithdraw({
    amountToBridge,
    tokenSymbol,
    successWaitTime = 1000,
    approveAllowance = false,
  }: {
    amountToBridge: string
    tokenSymbol: string
    successWaitTime?: number
    approveAllowance?: boolean
  }) {
    await this.bridgePage.switchToLightBridge()
    await this.bridgePage.openTokenPickerAndSelect(tokenSymbol)
    await this.bridgePage.bridgeButtonToBeDisable()
    await this.bridgePage.fillBridgingAmount(amountToBridge)
    this.page.waitForTimeout(1000)
    await this.bridgePage.bridgeButtonToBeEnable()
    const receivableAmt = Number(amountToBridge) * ((100 - 1) / 100)
    await this.bridgePage.validateBridgingFee({
      amount: receivableAmt.toFixed(4),
      token: tokenSymbol,
      estimatedTime: '~1min.',
    })
    await this.bridgePage.clickToBridge()
    await this.bridgePage.validateAndConfirmBridging({
      amount: amountToBridge,
      token: tokenSymbol,
      fromNetwork: 'Boba (Sepolia)',
      toNetwork: 'Ethereum (Sepolia)',
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

  async switchL2Network() {
    await this.basePage.clickToSwitchNetwork()
  }

  async addAndConnectBNBTestnet() {
    await this.connectToTestnet()
    await this.basePage.clickAndSwitchToBnb()
    await this.basePage.wait(1000)
  }
}
