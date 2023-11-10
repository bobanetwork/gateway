import Page from '../helpers/base/page'
const page = new Page()

describe('Page Layout', () => {
  before(() => {
    // added supported network only when actual check is done on connections
    // page.addSupportedNetwork()
    page.visit()
  })

  describe('Header', () => {
    it('Navigation links should be correct and functional', () => {
      page.checkNavigationListEthereum()
      page.setNetworkTo('BNB')
      page.checkNaviagtionListBinanace()
      page.setNetworkTo('AVAX')
      page.checkNaviagtionListAvalanche()
    })

    it('Theme switcher should work', () => {
      page.checkThemeSwitcher()
    })
  })

  describe('Application Banner', () => {
    it('Should see the earn deprecation banner and remove on close.', () => {
      page.validateApplicationBanner()
    })
  })

  describe('Footer', () => {
    it('Navigation links', () => {
      page.checkFooterLinks()
    })
    it('Social links', () => {
      page.checkSocialMediaLinks()
    })
    it('Gas details should be visible', () => {
      page.setNetworkTo('ETH')
      page.checkGasWatcherListingInETH()
    })
    it('Gas details should be visible with no status verifier value in cas of BNB', () => {
      page.setNetworkTo('BNB')
      page.checkGasWatcherListingInBNB()
    })
    it('Copyright & Version', () => {
      page.checkCopyrightAndVersion()
    })
  })
})
