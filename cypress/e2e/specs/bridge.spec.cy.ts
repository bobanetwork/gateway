import Bridge from '../helpers/bridge'
const bridge = new Bridge()

describe('Testing Entire Site', () => {
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
  })
})
