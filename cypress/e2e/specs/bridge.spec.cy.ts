import { LAYER } from '../../../src/util/constant'
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
      })

      describe('3rd party bridges', () => {
        it('Should have third party bridge tab with correct details', () => {
          bridge.setNetworkTo('ETH')
          bridge.checkThirdPartyTabInETH()
        })
        it('Should have third party bridge tab with correct details in case of BNB', () => {
          bridge.setNetworkTo('BNB')
          bridge.checkThirdPartyTabInBNB()
        })
      })

      describe('Light bridge', () => {
        it('Should have light bridge tab with correct details', () => {
          bridge.setNetworkTo('ETH', 'Testnet')
          bridge.checkIfLightBridgeTab()
        })
        it('Should have light bridge tab with correct details in case of BNB', () => {
          bridge.setNetworkTo('BNB', 'Testnet')
          bridge.checkIfLightBridgeTab()
        })
      })
    })
  })
})
