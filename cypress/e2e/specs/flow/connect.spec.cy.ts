import {
  MainnetL1Networks,
  MainnetL2Networks,
  TestnetL1Networks,
  TestnetL2Networks,
} from '../../helpers/base/constants'
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
    after(() => {
      bridge.disconnectWallet()
    })

    it('Should Connect to L1', () => {
      bridge.requestMetamaskConnect()
      bridge.connectMetamask()
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
    it('Should switch to Mainnet', () => {
      bridge.switchToMainnet()
    })
  })

  describe('- WalletConnect', () => {
    it('Should open connect wallet QR dialog', () => {
      bridge.requestWCConnect()
      bridge.checkWCQROpen()
    })
  })
})
