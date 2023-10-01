import Page from '../helpers/base/page'
const page = new Page()

describe('Page Layout', () => {
  before(() => {
    page.addSupportedNetwork()
    page.visit()
  })

  describe('Page Header', () => {
    it('Navigation links should be correct and functional', () => {
      page.checkNavigationListEthereum()
    })
    it('Theme switcher should work', () => {
      page.checkThemeSwitcher()
    })
  })
})
