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
    })
    describe('After wallet is connected', () => {
      it('Should Connect to L1', () => {
        bridge.requestMetamaskConnect()
        bridge.connectMetamask()
      })
      it('Should switch to an L2', () => {
        bridge.switchBridgeDirection(LAYER.L2, true)
      })
    })
  })
})
