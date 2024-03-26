import { Layer } from '../../../../src/util/constant'
import {
  EthereumGoerliInfo,
  EthereumInfo,
  EthereumSepoliaInfo,
} from '../../helpers/base/constants'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Testing General Bridging flow on Goerli', () => {
  before(() => {
    bridge.visit()
    bridge.isReady()
    bridge.changeMetamaskNetwork('ethereum')
  })
  after(() => {
    bridge.switchToMainnet(EthereumInfo.networkAbbreviation, false, false)
    bridge.disconnectWallet()
  })
  it('Should connect to metamask', () => {
    bridge.requestMetamaskConnect()
    bridge.verifyAccountConnected()
  })
  it('Should switch to testnet', () => {
    bridge.switchToTestnet()
  })
  it('Should switch to Sepolioa', () => {
    bridge.switchNetworkWithModals(
      EthereumGoerliInfo,
      EthereumSepoliaInfo,
      true,
      false
    )
  })
  it('Should bridge to L2', () => {
    bridge.bridgeToken('ETH', '0.0001', Layer.L2)
  })
  it('Should bridge to L2 to a different address', () => {
    bridge.bridgeToken(
      'ETH',
      '0.0001',
      Layer.L2,
      '0x2f6a5C6c4344ABC47048b19cC9a20322aA56069A',
      true
    )
  })
  it('Should switch to L2', () => {
    bridge.switchBridgeDirection(Layer.L2, false)
  })
  it.skip('Should bridge back to L1', () => {
    bridge.bridgeToken('ETH', '0.0001', Layer.L1)
  })
  it('Should switch to L1', () => {
    bridge.switchBridgeDirection(Layer.L1)
  })
})
