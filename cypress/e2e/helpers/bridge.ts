/// <reference types="cypress"/>
import Page from './base/page'
import { Layer } from '../../../src/util/constant'
import { NetworkTestInfo } from './base/types'
import {
  MainnetL1Networks,
  MainnetL2Networks,
  TestnetL1Networks,
  TestnetL2Networks,
} from './base/constants'

export default class Bridge extends Page {
  constructor() {
    super()
    this.id = 'bridge'
    this.walletConnectButtonText = 'Connect Wallet'
    this.title = 'Bridge'
  }

  checkNetworksModals(accountConnected: boolean) {
    // switch networks
    // switch through l1 networks, after switching to l1 networks switch to and from l2s.
    this.clickThroughNetworksInModals(
      MainnetL1Networks,
      MainnetL2Networks,
      accountConnected
    )
    // this.clickThroughNetworksInModals(
    //   MainnetL2Networks,
    //   MainnetL1Networks,
    //   accountConnected
    // )
    this.switchToTestnet()

    this.clickThroughNetworksInModals(
      TestnetL1Networks,
      TestnetL2Networks,
      accountConnected
    )
    // this.clickThroughNetworksInModals(
    //   TestnetL2Networks,
    //   TestnetL1Networks,
    //   accountConnected
    // )
  }

  openNetworkModal(networkName: string) {
    this.withinPage().contains(networkName).should('exist').click()
  }
  selectNetworkFromModal(networkName: string) {
    this.getModal().contains(networkName).should('exist').click()
  }
  clickThroughNetworksInModals(
    l1Networks: NetworkTestInfo[],
    l2Networks: NetworkTestInfo[],
    accountConnected: boolean
  ) {
    for (let i = 0; i < 3; i++) {
      this.withinPage().contains(l2Networks[i].networkName).should('exist')
      this.openNetworkModal(l1Networks[i].networkName)
      const nextNetwork = l1Networks[(i + 1) % 3]
      this.selectNetworkFromModal(nextNetwork.networkName)
      if (accountConnected) {
        this.handleNetworkSwitchModals(
          nextNetwork.networkAbbreviation,
          nextNetwork.isTestnet
        )
        this.allowNetworkSwitch()
        this.checkNetworkSwitchSuccessful(nextNetwork.networkAbbreviation)
      } else {
        this.store.allowBaseEnabledToUpdate(accountConnected)
      }
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
      .find('svg')
      .filter((_, e) => {
        const srcRegEx = RegExp('[^\\]*close.[a-zA-Z0-9]*.(svg)')
        const data_src = Cypress.$(e).attr('data-src')
        if (data_src) {
          return srcRegEx.test(data_src)
        }
        return false
      })
      .should('have.length', 1)
      .click()
  }
}
