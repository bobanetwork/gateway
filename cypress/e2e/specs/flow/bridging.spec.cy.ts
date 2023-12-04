import { Layer } from '../../../../src/util/constant'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Testing General Bridging flow on Goerli', () => {
  before(() => {
    bridge.visit()
    bridge.isReady()
  })
  after(() => {
    bridge.switchToMainnet()
  })
  it('Should connect to metamask', () => {
    bridge.requestMetamaskConnect()
  })
  it('Should switch to testnet', () => {
    bridge.switchToTestnet()
  })
  it('Should bridge to L2', () => {
    bridge.bridgeToken('ETH', '0.0001', Layer.L2)
  })
  it('Should bridge to L2 to a different address', () => {
    bridge.bridgeToken(
      'ETH',
      '0.0001',
      Layer.L2,
      '0x2f6a5C6c4344ABC47048b19cC9a20322aA56069A'
    )
  })
  it('Should switch to L2', () => {
    bridge.switchBridgeDirection(Layer.L2, true)
  })
  it('Should bridge back to L1', () => {
    bridge.bridgeToken('ETH', '0.0001', Layer.L1)
  })
  it('Should switch to L1', () => {
    bridge.switchBridgeDirection(Layer.L1, false)
  })
})
