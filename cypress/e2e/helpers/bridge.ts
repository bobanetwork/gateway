/// <reference types="cypress"/>
import Page from './base/page'
import { Layer } from '../../../src/util/constant'
import { BridgeType, NetworkTestInfo } from './base/types'
import { EthereumGoerliInfo, EthereumInfo } from './base/constants'

export default class Bridge extends Page {
  type: string
  constructor() {
    super()
    this.id = 'bridge'
    this.walletConnectButtonText = 'Connect Wallet'
    this.title = 'Bridge'
    this.type = BridgeType.Classic
  }

  switchToTestnet(
    networkAbbreviation: string = EthereumGoerliInfo.networkAbbreviation,
    newNetwork: boolean = false
  ) {
    this.switchNetworkType(networkAbbreviation, true, newNetwork)
  }

  switchToMainnet(
    networkAbbreviation: string = EthereumInfo.networkAbbreviation,
    newNetwork: boolean = false
  ) {
    this.switchNetworkType(networkAbbreviation, false, newNetwork)
  }

  openSettings() {
    this.withinPage()
      .find('[data-testid="setting-btn"]')
      .should('exist')
      .click()
  }

  toggleShowTestnets() {
    this.getModal()
      .find('[data-testid="switch-label"]')
      .should('have.length', 2)
      .first()
      .click()
  }

  toggleAddDestinationAddress() {
    this.getModal()
      .find('[data-testid="switch-label"]')
      .should('have.length', 2)
      .eq(1)
      .click()
  }
  closeModal(dataTestId: String) {
    this.getModal()
      .find(`[data-testid="close-modal-${dataTestId}"]`)
      .should('exist')
      .click()
  }
  openTokenPicker() {
    this.withinPage().contains('Select').should('exist').click()
  }
  verifyTokenInTokenList(tokenSymbol: string) {
    this.getModal().contains(tokenSymbol).should('exist')
  }
  addTokenWithTokenPicker(tokenSymbol: string) {
    this.getModal()
      .contains(tokenSymbol)
      .siblings()
      .filter('[data-testid="add-token"]')
      .should('exist')
      .click()
    this.allowMetamskToAddToken()
  }

  switchNetworkType(
    networkAbbreviation: string,
    isTestnet: boolean,
    newNetwork: boolean
  ) {
    if (this.onTestnet === isTestnet) {
      return
    }
    this.openSettings()
    this.toggleShowTestnets()

    this.store.verifyReduxStoreNetwork(
      'activeNetworkType',
      isTestnet ? 'Testnet' : 'Mainnet'
    )

    this.handleNetworkSwitchModals(networkAbbreviation, isTestnet)
    this.allowNetworkSwitch(newNetwork)
    this.checkNetworkSwitchSuccessful(networkAbbreviation)

    this.store.verifyReduxStoreSetup('accountEnabled', true)
    this.store.verifyReduxStoreSetup('baseEnabled', true)
    this.onTestnet = isTestnet
  }

  switchBridgeDirection(newOriginLayer: Layer, newNetwork: boolean = false) {
    this.withinPage().find('#switchBridgeDirection').should('exist').click()
    if (newNetwork) {
      this.allowNetworkToBeAddedAndSwitchedTo()
    } else {
      this.allowNetworkToBeSwitchedTo()
    }
    this.store.verifyReduxStoreSetup('netLayer', newOriginLayer)
  }

  selectToken(tokenSymbol: string) {
    this.openTokenPicker()

    cy.get('div[title="tokenList"]')
      .contains(tokenSymbol)
      .should('exist')
      .click()

    // ensure store has correct values
    this.store.verifyTokenSelected(tokenSymbol)

    // ensure img has loaded before typing in amount
    this.withinPage()
      .get('#tokenSelectorInput')
      .find('img[alt="ETH logo"]')
      .should('be.visible')
      .and('have.prop', 'naturalWidth')
      .should('be.greaterThan', 0)
  }

  bridgeToken(
    tokenSymbol: string,
    amount: string,
    destinationLayer: Layer,
    destinationAddress: string = ''
  ) {
    if (destinationAddress && destinationLayer === Layer.L2) {
      this.openSettings()
      this.toggleAddDestinationAddress()
      this.closeModal('settings-modal')
      this.withinPage()
        .find('input[placeholder="Enter destination address"]')
        .should('exist')
        .focus()
        .type(destinationAddress)
    }
    this.selectToken(tokenSymbol)

    if (destinationLayer === Layer.L1) {
      this.store.verifyReduxStateNotEmpty('setup', 'bobaFeePriceRatio')
      this.store.verifyReduxStoreSetup('netLayer', Layer.L2)
      this.store.verifyReduxStateNotEmpty('balance', 'exitFee')
      this.store.verifyReduxStoreBalance('classicExitCost', 0)
    }

    this.withinPage()
      .find(`input[placeholder="Amount to bridge to ${destinationLayer}"]`)
      .should('exist')
      .focus()
      .type(`${amount}`)

    this.store
      .getReduxStore()
      .its('bridge')
      .its('amountToBridge')
      .then(parseFloat)
      .should('equal', parseFloat(amount))

    cy.get('button').contains('Bridge').should('exist').click()
    cy.contains(`${amount} ${tokenSymbol}`, { timeout: 60000 }).should('exist')
    cy.get('button').contains('Confirm').should('exist').click()
    if (destinationLayer === Layer.L1) {
      this.allowMetamaskToSpendToken('10')
    }

    this.confirmTransactionOnMetamask()

    if (destinationLayer === Layer.L2) {
      this.getModal().contains('Estimated time to complete :').should('exist')
      this.closeModal('bridge-in-progress')
    } else {
      this.getModal()
        .contains('Your funds will arrive in 7 days at your wallet on')
        .should('exist')
      this.closeModal('transactionSuccess-modal')
    }
  }

  checkThirdPartyTabInETH() {
    cy.get('[data-testid="third-party-btn"]').should('be.visible').click()

    cy.contains('Third party bridges').should('be.visible')

    const bridgelist = cy.get('a[data-testid="bridge-item"]')
    bridgelist.should('not.be.empty').and((bridgeItems) => {
      // should have 8 elements.
      expect(bridgeItems).to.have.length(2)

      const links = bridgeItems.map((i, el) => {
        return Cypress.$(el).attr('href')
      })

      expect(links.get()).to.deep.eq([
        'https://boba.banxa.com/',
        'https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=Boba%20Ethereum&tokenIn=ETH&tokenOut=ETH',
      ])

      const labels = bridgeItems.map((i, el) => {
        return Cypress.$(el).text()
      })

      expect(labels.get()).to.deep.eq(['Banxa', 'Symbiosis'])
    })
  }

  checkThirdPartyTabInBNB() {
    cy.get('[data-testid="third-party-btn"]').should('be.visible').click()
    cy.contains('Third party bridges').should('be.visible')
    cy.contains('No bridges available').should('be.visible')
  }

  openNetworkModal(networkName: string) {
    this.withinPage().contains(networkName).should('exist').click()
  }
  selectNetworkFromModal(networkName: string) {
    this.getModal().contains(networkName).should('exist').click()
  }

  switchNetworkWithModals(
    fromNetwork: NetworkTestInfo,
    toNetwork: NetworkTestInfo,
    accountConnected: boolean,
    newNetwork: boolean
  ) {
    this.openNetworkModal(fromNetwork.networkName)
    this.selectNetworkFromModal(toNetwork.networkName)
    if (accountConnected) {
      if (this.type === BridgeType.Classic) {
        this.handleNetworkSwitchModals(
          toNetwork.networkAbbreviation,
          toNetwork.isTestnet
        )
      }
      this.allowNetworkSwitch(newNetwork)
      this.checkNetworkSwitchSuccessful(toNetwork.networkAbbreviation)
    } else {
      this.store.allowBaseEnabledToUpdate(accountConnected)
    }
  }

  clickThroughNetworksInModals(
    l1Networks: NetworkTestInfo[],
    l2Networks: NetworkTestInfo[],
    accountConnected: boolean
  ) {
    for (let i = 0; i < 2; i++) {
      this.withinPage().contains(l2Networks[i].networkName).should('exist')
      const nextNetwork = l1Networks[(i + 1) % 2]
      this.switchNetworkWithModals(
        l1Networks[i],
        nextNetwork,
        accountConnected,
        nextNetwork.networkName !== l1Networks[0].networkName
      )
      this.switchBridgeDirection(Layer.L2, true)
      this.switchBridgeDirection(Layer.L1)
    }
  }

  switchBridgeType(
    bridgeType: BridgeType,
    currentNetwork: NetworkTestInfo = EthereumGoerliInfo
  ) {
    this.withinPage().contains(bridgeType).should('exist').click()
    this.store.verifyReduxStoreBridge('bridgeType', bridgeType.toUpperCase())
    if (
      this.type === BridgeType.Light &&
      currentNetwork !== EthereumGoerliInfo
    ) {
      this.getModal()
        .find(
          `button[label="Switch to ${currentNetwork.networkAbbreviation} ${
            currentNetwork.isTestnet ? 'Testnet' : ''
          } network"]`,
          { timeout: 90000 }
        )
        .should('exist')
        .click()

      this.store.verifyReduxStoreSetup('accountEnabled', false)
      this.store.verifyReduxStoreSetup('baseEnabled', false)
      this.store.verifyReduxStoreSetup('baseEnabled', true)
    }
    this.type = bridgeType
  }
}
