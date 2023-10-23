import Bridge from '../helpers/bridge'
const bridge = new Bridge()

describe.only('Testing Entire Site', () => {
  describe('Bridge', () => {
    describe('Before wallet is connected', () => {
      before(() => {
        bridge.visit()
        bridge.store.verifyReduxStoreSetup('baseEnabled', true)
      })
      describe('Bridge Layout', () => {
        it('Should have the correct title', () => {
          bridge.checkTitle()
        })
        it('Should have functional network modals', () => {
          const accountConnected = false
          bridge.checkNetworksModals(accountConnected)
        })
      })
    })
    describe.only('After wallet is connected', () => {
      before(() => {
        bridge.visit()
        bridge.isReady()
        bridge.addSupportedNetwork()
        bridge.changeMetamaskNetwork('ethereum')
        bridge.requestMetamaskConnect()
        bridge.connectMetamask()
        bridge.accountConnected()
      })
      describe('Bridge Layout', () => {
        it('Should have the correct title', () => {
          bridge.checkTitle()
        })
        it('Should have functional network modals', () => {
          const accountConnected = true
          bridge.checkNetworksModals(accountConnected)
        })
      })
    })
  })
})
