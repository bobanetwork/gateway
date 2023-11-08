import { LAYER } from '../../../../src/util/constant'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Connect flow', () => {
  before(() => {
    bridge.visit()
    bridge.store.verifyReduxStoreSetup('baseEnabled', true)
  })

  describe('- Metamask', () => {
    before(() => {
      bridge.changeMetamaskNetwork('ethereum')
    })
    after(() => {
      bridge.disconnectWallet()
    })

    it('Should Connect to L1', () => {
      bridge.requestMetamaskConnect()
      bridge.connectMetamask()
    })
    it('Should switch to Boba L2 and back', () => {
      bridge.switchBridgeDirection(LAYER.L2, true)
      bridge.switchBridgeDirection(LAYER.L1, false)
    })
  })

  describe('- WalletConnect', () => {
    it('Should open connect wallet QR dialog', () => {
      bridge.requestWCConnect()
      bridge.checkWCQROpen()
    })
  })
})
