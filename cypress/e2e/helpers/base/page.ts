/// <reference types="cypress"/>
import Base from './base'
import PageHeader from './page.header'
import PageFooter from './page.footer'
import { ReduxStore } from './store'
import { pageTitleWhiteList } from '../../../../src/components/layout/PageTitle/constants'
import { NetworkTestInfo } from './types'

export default class Page extends Base {
  header: PageHeader
  footer: PageFooter
  store: ReduxStore
  walletConnectButtonText: string
  id: string
  title: string
  onTestnet: boolean
  constructor() {
    super()
    this.store = new ReduxStore()
    this.header = new PageHeader()
    this.footer = new PageFooter()
    this.id = 'header'
    this.walletConnectButtonText = 'Connect Wallet'
    this.title = 'Bridge'
    this.onTestnet = false
  }

  visit() {
    cy.visit(`/${this.id}`)
  }

  isReady() {
    this.store.verifyReduxStoreSetup('baseEnabled', true)
  }

  withinPage() {
    return cy.get(`#${this.id}`)
  }

  getTitle() {
    return cy.get(`#title`)
  }

  connectWallet() {
    this.withinPage()
      .contains('button', this.walletConnectButtonText)
      .should('exist')
      .click()
  }

  requestMetamaskConnect() {
    this.connectWallet()
    this.getModal().contains('MetaMask').should('exist').click()
  }

  requestWCConnect() {
    this.connectWallet()
    this.getModal().contains('WalletConnect').should('exist').click()
  }

  checkWCQROpen() {
    cy.wait(1000)

    cy.get('body').find('wcm-modal').should('exist')
  }

  setNetworkTo(network: 'BNB' | 'ETH', type = 'Mainnet') {
    const bnbConfig = {
      network: 'BNB',
      name: {
        l1: 'Binance Smart Chain',
        l2: 'Boba BNB',
      },
      networkIcon: 'bnb',
      chainIds: { L1: '56', L2: '56288' },
      networkType: type,
    }

    const ethConfig = {
      network: 'ETHEREUM',
      name: {
        l1: 'Mainnet',
        l2: 'Boba L2',
      },
      networkIcon: 'ethereum',
      chainIds: { L1: '1', L2: '288' },
      networkType: type,
    }

    let payload = ethConfig
    if (network === 'BNB') {
      payload = bnbConfig
    }

    cy.window().its('store').invoke('dispatch', {
      type: 'NETWORK/SET',
      payload,
    })
  }

  verifyAccountConnected() {
    this.store.verifyReduxStoreSetup('accountEnabled', true)
    this.store
      .getReduxStore()
      .its('setup')
      .its('walletAddress')
      .should('not.be.empty')
  }

  checkNaviagtionListBinanace() {
    this.header
      .getNavigationLinks()
      .should('not.be.empty')
      .and(($p) => {
        // should have found 3 elements for Binanace
        expect($p).to.have.length(3)

        // // use jquery's map to grab all of their classes
        // // jquery's map returns a new jquery object
        const links = $p.map((i, el) => {
          return Cypress.$(el).attr('href')
        })
        // call classes.get() to make this a plain array
        expect(links.get()).to.deep.eq(['/bridge', '/bridge', '/history'])

        // get labels and verify
        const labels = $p.map((i, el) => {
          return Cypress.$(el).text()
        })

        expect(labels.get()).to.deep.eq(['', 'Bridge', 'History'])
      })
  }

  validateApplicationBanner() {
    cy.get('[data-testid="banner-item"]')
      .should('not.be.empty')
      .should('be.visible')
      .and(($p) => {
        expect($p).to.have.length(2)
      })
  }

  checkNavigationListEthereum() {
    this.header
      .getNavigationLinks()
      .should('not.be.empty')
      .and(($p) => {
        // should have found 5 elements for Ethereum
        expect($p).to.have.length(5)

        // // use jquery's map to grab all of their classes
        // // jquery's map returns a new jquery object
        const links = $p.map((i, el) => {
          return Cypress.$(el).attr('href')
        })
        // call classes.get() to make this a plain array
        expect(links.get()).to.deep.eq([
          '/bridge',
          '/bridge',
          '/history',
          '/stake',
          '/dao',
        ])

        // get labels and verify
        const labels = $p.map((i, el) => {
          return Cypress.$(el).text()
        })

        expect(labels.get()).to.deep.eq([
          '',
          'Bridge',
          'History',
          'Stake',
          'Dao',
        ])
      })
  }
  checkNetworkSwitcherMainnet() {
    this.header.getNetworkSwitcher().click()

    this.header.getNetworkSwitcher().contains('Ethereum').should('exist')

    this.header
      .getNetworkSwitcher()
      .contains('Binance Smart Chain')
      .should('exist')

    this.header.getNetworkSwitcher().click()
  }
  checkNetworkSwitcherTestnet() {
    this.header
      .getNetworkSwitcher()
      .click()
      .should('have.text', 'Ethereum (Goerli)')
      .should('have.text', 'BNB Testnet')
  }

  // check theme switching functionality
  checkThemeSwitcher() {
    this.header.getLightThemeSwitcher().click()
    this.store.verifyReduxUiState('theme', 'light')
    this.header.getDarkThemeSwitcher().click()
    this.store.verifyReduxUiState('theme', 'dark')
  }

  handleNetworkSwitchModals(
    networkAbbreviation: string,
    isTestnet: boolean,
    newNetwork: boolean
  ) {
    this.getModal()
      .find(
        `button[label="Switch to ${networkAbbreviation} ${
          isTestnet ? 'Testnet' : ''
        } network"]`,
        { timeout: 90000 }
      )
      .should('exist')
      .click()

    this.store.verifyReduxStoreSetup('accountEnabled', false)
    this.store.verifyReduxStoreSetup('baseEnabled', false)
    this.store.verifyReduxStoreSetup('baseEnabled', true)

    this.getModal()
      .find(
        `button[label="Connect to the ${networkAbbreviation} ${
          isTestnet ? 'Testnet' : 'Mainnet'
        } network"]`,
        { timeout: 90000 }
      )
      .should('exist')
      .click()

    if (newNetwork) {
      this.allowNetworkToBeAddedAndSwitchedTo()
    } else {
      this.allowNetworkSwitch()
    }
    this.checkNetworkSwitchSuccessful(networkAbbreviation)
  }

  checkNetworkSwitchSuccessful(networkAbbreviation: string) {
    this.store.verifyReduxStoreNetwork('activeNetwork', networkAbbreviation)

    this.store.verifyReduxStoreSetup('accountEnabled', true)
    this.store.verifyReduxStoreSetup('baseEnabled', true)
  }

  disconnectWallet() {
    this.header.disconnectWallet()
  }

  //******FOOTER HELPERS******//
  checkFooterLinks() {
    this.footer
      .getFooterLinks()
      .should('not.be.empty')
      .and(($p) => {
        // should have found 4 elements
        expect($p).to.have.length(5)
        // make sure the first contains some text content
        expect($p.first()).to.contain('FAQs')
        // // use jquery's map to grab all of their classes
        // // jquery's map returns a new jquery object
        const links = $p.map((i, el) => {
          return Cypress.$(el).attr('href')
        })
        // call classes.get() to make this a plain array
        expect(links.get()).to.deep.eq([
          'https://docs.boba.network/faq',
          'https://docs.boba.network/for-developers',
          '/bobascope',
          'https://boba.network',
          'https://boba.network/terms-of-use/',
        ])
        // get labels and verify
        const labels = $p.map((i, el) => {
          return Cypress.$(el).text()
        })
        expect(labels.get()).to.deep.eq([
          'FAQs',
          'Dev Tools',
          'Bobascope',
          'Boba Network Website',
          'Terms of Use',
        ])
      })
  }

  checkSocialMediaLinks() {
    this.footer
      .getSocialMediaLinks()
      .should('not.be.empty')
      .and(($p) => {
        // should have found 4 elements
        expect($p).to.have.length(4)

        // // use jquery's map to grab all of their classes
        // // jquery's map returns a new jquery object
        const links = $p.map((i, el) => {
          return Cypress.$(el).attr('href')
        })
        // call classes.get() to make this a plain array
        expect(links.get()).to.deep.eq([
          'https://docs.boba.network',
          'https://boba.eco/twitter',
          'https://boba.eco/discord',
          'https://boba.eco/telegram',
        ])

        // get labels and verify
        const labels = $p.map((i, el) => {
          return Cypress.$(el).attr('aria-label')
        })

        expect(labels.get()).to.deep.eq([
          'bobadocs',
          'twitter',
          'discord',
          'telegram',
        ])
      })
  }

  checkCopyrightAndVersion() {
    this.footer.getCompanyInfo().should('be.visible')
    this.footer.getVersionInfo().should('be.visible')
  }
  checkTitle() {
    if (this.id === 'bridge') {
      this.withinPage().contains(this.title).should('exist')
    } else {
      this.getTitle().contains(this.title).should('exist')
    }
  }
  checkDescription() {
    const webPage = pageTitleWhiteList.find(
      (whiteListedPage) => whiteListedPage.path === '/' + this.id.toLowerCase()
    )
    const slogan = webPage ? webPage.slug : ''
    if (!slogan) {
      return assert(false)
    }
    this.getTitle().contains(slogan)
  }

  checkGasWatcherListingInETH() {
    this.footer
      .gasDetailsInfo()
      .should('not.be.empty')
      .and(($p) => {
        expect($p).to.have.length(6)
      })
  }

  checkGasWatcherListingInBNB() {
    this.footer
      .gasDetailsInfo()
      .should('not.be.empty')
      .and(($p) => {
        expect($p).to.have.length(5)
      })
  }
  switchNetwork(network: NetworkTestInfo, newNetwork: boolean = false) {
    this.header.getNetworkSwitcher().click()
    this.header
      .getNetworkSwitcher()
      .contains(network.networkName)
      .should('exist')
      .click()
    this.handleNetworkSwitchModals(
      network.networkAbbreviation,
      network.isTestnet,
      newNetwork
    )
  }
}
