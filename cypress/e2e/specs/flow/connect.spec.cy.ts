import { Layer } from '../../../../src/util/constant'
import {
  ArbitrumGoerliInfo,
  BinanceTestnetInfo,
  BobaGoerliInfo,
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

    it('Should switch through Mainnet networks using Network Picker Modal', () => {
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
      bridge.switchBridgeType(BridgeType.Light)
      bridge.switchBridgeDirection(Layer.L2, false)
    })

    // Skipping while we determine what to do with optimism goerli
    it.skip('Should switch to Optimism', () => {
      bridge.switchNetworkWithModals(
        BobaGoerliInfo,
        OptimismGoerliInfo,
        true,
        true
      )
    })

    it('Should switch to Arbitrum', () => {
      bridge.switchNetworkWithModals(
        BobaGoerliInfo,
        ArbitrumGoerliInfo,
        true,
        true
      )
    })

    it('Should switch to BNB', () => {
      bridge.switchNetworkWithModals(
        ArbitrumGoerliInfo,
        BinanceTestnetInfo,
        true,
        false
      )
    })

    it('Should switch back to classic bridge', () => {
      bridge.switchNetworkWithModals(
        BinanceTestnetInfo,
        BobaGoerliInfo,
        true,
        false
      )
      bridge.switchBridgeDirection(Layer.L1)
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
