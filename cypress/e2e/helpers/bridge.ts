/// <reference types="cypress"/>
import Page from './base/page'
import { Layer } from '../../../src/util/constant'

export default class Bridge extends Page {
  constructor() {
    super()
    this.id = 'bridge'
    this.walletConnectButtonText = 'Connect Wallet'
    this.title = 'Bridge'
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
  allowToDestinationAddress() {
    this.withinPage().find('#settings').should('exist').click()
    this.getModal()
      .find('[data-testid="switch-label"]')
      .should('have.length', 2)
      .first()
      .next()
      .click()
    // verify through store.
    this.store.verifyReduxBridgeState('bridgeDestinationAddressAvailable', true)
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
  bridgeToken(
    tokenSymbol: string,
    amount: string,
    destinationLayer: Layer,
    destinationAddress: string = ''
  ) {
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
    if (destinationAddress) {
      this.allowToDestinationAddress()
      cy.get('[placeholder="Enter destination address"]')
        .should('exist')
        .focus()
        .type(destinationAddress)
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

  checkThirdPartyTabInETH() {
    cy.get('[data-testid="third-party-btn"]').should('be.visible').click()

    cy.contains('Third party bridges').should('be.visible')

    const bridgelist = cy.get('a[data-testid="bridge-item"]')
    bridgelist.should('not.be.empty').and((bridgeItems) => {
      // should have 12 elements.
      expect(bridgeItems).to.have.length(12)

      const links = bridgeItems.map((i, el) => {
        return Cypress.$(el).attr('href')
      })

      expect(links.get()).to.deep.eq([
        'https://boba.banxa.com/',
        'https://boba.network/project/beamer-bridge/',
        'https://boba.network/project/boringdao/',
        'https://boba.network/project/celer/',
        'https://boba.network/project/chainswap/',
        'https://boba.network/project/connext/',
        'https://boba.network/project/layerswap-io/',
        'https://boba.network/project/multichain/',
        'https://boba.network/project/rango-exchange/',
        'https://boba.network/project/rubic-exchange/',
        'https://boba.network/project/synapse/',
        'https://boba.network/project/via-protocol/',
      ])

      const labels = bridgeItems.map((i, el) => {
        return Cypress.$(el).text()
      })

      expect(labels.get()).to.deep.eq([
        'Banxa',
        'Beamer Bridge',
        'BoringDAO',
        'Celer',
        'Chainswap',
        'Connext',
        'Layerswap',
        'Multichain',
        'Rango Exchange',
        'Rubic Exchange',
        'Synapse',
        'Via Protocol',
      ])
    })
  }

  checkThirdPartyTabInBNB() {
    cy.get('[data-testid="third-party-btn"]').should('be.visible').click()
    cy.contains('Third party bridges').should('be.visible')
    cy.contains('No bridges available').should('be.visible')
  }
}
