/// <reference types="cypress"/>
import Page from './base/page'
import { Layer } from '../../../src/util/constant'
import {
  mainnetL1NetworkNames,
  mainnetL2NetworkNames,
  testnetL1NetworkNames,
  testnetL2NetworkNames,
} from './base/constants'

import { NETWORK_TYPE } from '../../../src/util/network/network.util'

export default class Bridge extends Page {
  constructor() {
    super()
    this.id = 'bridge'
    this.walletConnectButtonText = 'Connect Wallet'
    this.title = 'Bridge'
    // console.log(cy.NetworkUtils.NETWORK_TYPE)
  }

  checkNetworksModals(accountConnected: boolean) {
    this.clickThroughNetworksInModals(
      mainnetL1NetworkNames,
      mainnetL2NetworkNames,
      accountConnected
    )
    this.clickThroughNetworksInModals(
      mainnetL2NetworkNames,
      mainnetL1NetworkNames,
      accountConnected
    )
    this.switchToTestnet()

    this.clickThroughNetworksInModals(
      testnetL1NetworkNames,
      testnetL2NetworkNames,
      accountConnected
    )
    this.clickThroughNetworksInModals(
      testnetL2NetworkNames,
      testnetL1NetworkNames,
      accountConnected
    )
  }

  openNetworkModal(networkName: string) {
    this.withinPage().contains(networkName).should('exist').click()
  }
  selectNetworkFromModal(networkName: string) {
    this.getModal().contains(networkName).should('exist').click()
  }
  clickThroughNetworksInModals(
    networksToSwitchThrough: string[],
    correspondingNetworks: string[],
    accountConnected: boolean
  ) {
    for (let i = 0; i < 3; i++) {
      this.withinPage().contains(correspondingNetworks[i]).should('exist')
      this.openNetworkModal(networksToSwitchThrough[i])
      this.selectNetworkFromModal(networksToSwitchThrough[(i + 1) % 3])
      this.store.allowBaseEnabledToUpdate(accountConnected)
    }
  }

  switchNetworkType(network: string, isTestnet: boolean, newNetwork: boolean) {
    this.withinPage().find('#settings').should('exist').click()
    cy.get('label[title="testnetSwitch"]').should('exist').click()

    this.store.verifyReduxStoreNetwork(
      'activeNetworkType',
      isTestnet ? 'Testnet' : 'Mainnet'
    )

    this.handleNetworkSwitchModals(network, isTestnet)

    if (newNetwork) {
      this.allowNetworkToBeAddedAndSwitchedTo()
    } else {
      this.allowNetworkSwitch()
    }

    this.checkNetworkSwitchSuccessful(network)
  }

  switchBridgeDirection(newOriginLayer: Layer, newNetwork: boolean) {
    this.withinPage().find('#switchBridgeDirection').should('exist').click()
    if (newNetwork) {
      this.allowNetworkToBeAddedAndSwitchedTo()
    } else {
      this.allowNetworkSwitch()
    }
    this.store.verifyReduxStoreSetup('netLayer', newOriginLayer)
  }

  selectToken(tokenSymbol: string) {
    this.withinPage().contains('Select').should('exist').click()

    cy.get('div[title="tokenList"]')
      .contains(tokenSymbol)
      .should('exist')
      .click()

    // ensure store has correct values
    this.store
      .getReduxStore()
      .its('bridge')
      .its('tokens')
      .its(0)
      .should('exist')
      .its('symbol')
      .should('equal', tokenSymbol)

    // ensure img has loaded before typing in amount
    this.withinPage()
      .get('#tokenSelectorInput')
      .find('img[alt="ETH logo"]')
      .should('be.visible')
      .and('have.prop', 'naturalWidth')
      .should('be.greaterThan', 0)
  }

  bridgeToken(tokenSymbol: string, amount: string, destinationLayer: Layer) {
    this.selectToken(tokenSymbol)
    if (destinationLayer === Layer.L1) {
      this.store
        .getReduxStore()
        .its('setup')
        .its('bobaFeePriceRatio')
        .should('not.be.empty')

      this.store.verifyReduxStoreSetup('netLayer', Layer.L2)
      this.store
        .getReduxStore()
        .its('balance')
        .its('exitFee')
        .should('not.be.empty')
      this.store
        .getReduxStore()
        .its('balance')
        .its('classicExitCost')
        .should('equal', 0)
    }

    cy.get(`input[placeholder="Amount to bridge to ${destinationLayer}"]`)
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
    } else {
      this.getModal()
        .contains('Your funds will arrive in 7 days at your wallet on')
        .should('exist')
    }
    this.getModal()
      .find('div[aria-label=closeModalIcon]')
      .should('have.length', 1)
      .click()
  }
  switchToTestnet() {
    this.withinPage().find('#settings').should('exist').click()
    this.getModal().find('label[title="testnetSwitch"]').should('exist').click()

    this.store.verifyReduxStoreNetwork('activeNetworkType', 'Testnet')
    this.getModal() // filter can be used to accomplish this
      .find('svg[data-src^=/[^\\]*close.[a-zA-Z0-9]*.(svg)$/]')
      .should('have.length', 1)
      .click()
  }
}
