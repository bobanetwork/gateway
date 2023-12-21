import { Layer } from '../../../../src/util/constant'
import {
  ArbitrumGoerliInfo,
  MainnetL1Networks,
  MainnetL2Networks,
  OptimismGoerliInfo,
  TestnetL1Networks,
  TestnetL2Networks,
} from '../../helpers/base/constants'
import { BridgeType } from '../../helpers/base/types'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Connect flow', () => {
  before(() => {
    bridge.visit()
    bridge.isReady()
  })

  describe('Metamask', () => {
    before(() => {
      bridge.changeMetamaskNetwork('ethereum')
    })

    it('Should Connect to L1', () => {
      bridge.requestMetamaskConnect()
      bridge.connectMetamask()
      bridge.verifyAccountConnected()
    })

    it.skip('Should switch through Mainnet networks using Network Picker Modal', () => {
      bridge.clickThroughNetworksInModals(
        MainnetL1Networks,
        MainnetL2Networks,
        true
      )
    })

    it('Switch to testnet', () => {
      bridge.switchToTestnet()
    })

    it('Should switch through Testnet networks using Network Modal', () => {
      bridge.clickThroughNetworksInModals(
        TestnetL1Networks,
        TestnetL2Networks,
        true
      )
    })

    it('Should be able to switch to the light bridge', () => {
      bridge.switchBridgeDirection(Layer.L2, false)
      bridge.switchBridgeType(BridgeType.Light)
    })

    it('Should switch to Optimism', () => {
      bridge.switchNetwork(OptimismGoerliInfo, true)
      bridge.switchBridgeDirection(Layer.L1, false)
      bridge.switchBridgeDirection(Layer.L2, false)
    })

    it('Should switch to Arbitrum', () => {
      bridge.switchNetwork(ArbitrumGoerliInfo, true)
      bridge.switchBridgeDirection(Layer.L1, false)
    })

    it('Should switch back to classic bridge', () => {
      bridge.switchBridgeType(BridgeType.Classic)
    })

    it('Should switch to Mainnet', () => {
      bridge.switchToMainnet()
    })

    it('Should disconnect wallet', () => {
      bridge.disconnectWallet()
    })
  })

  describe('WalletConnect', () => {
    it('Should open connect wallet QR dialog', () => {
      bridge.requestWCConnect()
      bridge.checkWCQROpen()
    })
  })
})
