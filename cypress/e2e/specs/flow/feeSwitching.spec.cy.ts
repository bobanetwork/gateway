import { Layer } from '../../../../src/util/constant'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Fee Switching', () => {
  before(() => {
    bridge.visit()
    bridge.isReady()
    bridge.requestMetamaskConnect()
    bridge.verifyAccountConnected()
  })
  it('Fee switcher should not exist when connected to Ethereum', () => {
    bridge.header.getFeeSwitcher().should('not.exist')
  })
  it('Fee switcher should exist when connected to Boba Network', () => {
    // switch to Boba Network
    bridge.switchBridgeDirection(Layer.L2)
    bridge.header.getFeeSwitcher().contains('ETH').should('exist')
  })
  it('Should switch to testnet to use fee switcher', () => {
    bridge.switchBridgeDirection(Layer.L1)
    bridge.switchToTestnet()
    bridge.switchBridgeDirection(Layer.L2)
  })
  it('Use Fee Switcher to switch fee to BOBA', () => {
    bridge.selectToken('BOBA')
    bridge.header.switchFees('ETH', 'BOBA')
  })
  it('Use Fee Switcher to switch fee to ETH', () => {
    bridge.header.switchFees('BOBA', 'ETH')
    bridge.switchBridgeDirection(Layer.L1)
  })

  after(() => {
    bridge.switchBridgeDirection(Layer.L1)
    bridge.switchToMainnet()
    bridge.disconnectWallet()
  })
})
