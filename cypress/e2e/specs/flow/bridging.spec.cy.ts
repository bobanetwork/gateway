import { Layer } from '../../../../src/util/constant'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Testing General Bridging flow', () => {
  before(() => {
    bridge.visit()
    bridge.isReady()
    bridge.changeMetamaskNetwork('ethereum')
  })
  it('Should connect to metamask', () => {
    bridge.requestMetamaskConnect()
    bridge.connectMetamask()
  })
  it('Should switch to testnet', () => {
    bridge.switchToTestnet()
  })
  it('Basic Bridge to L2', () => {
    bridge.bridgeToken('ETH', '0.0001', Layer.L2)
  })
  it('Bridging to L2 to a different address', () => {
    bridge.bridgeToken(
      'ETH',
      '0.0001',
      Layer.L2,
      '0x2f6a5C6c4344ABC47048b19cC9a20322aA56069A'
    )
  })
})
