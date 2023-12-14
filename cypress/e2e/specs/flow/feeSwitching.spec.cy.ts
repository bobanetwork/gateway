import { Layer } from '../../../../src/util/constant'
import {
  EthereumGoerliInfo,
  BinanceTestnetInfo,
} from '../../helpers/base/constants'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Fee Switching', () => {
  before(() => {
    bridge.visit()
    bridge.isReady()
    bridge.changeMetamaskNetwork('ethereum')
    bridge.requestMetamaskConnect()
    bridge.connectMetamask()
  })
  it('Fee switcher should not exist when connected to Ethereum', () => {
    bridge.header.getFeeSwitcher().should('not.exist')
  })
  it('Fee switcher should exist when connected to Boba Network', () => {
    // switch to Boba Network
    bridge.switchBridgeDirection(Layer.L2, true) // change to false after incorporating previous test
    bridge.header.getFeeSwitcher().contains('ETH').should('exist')
  })
  it('Should switch to testnet to use fee switcher', () => {
    bridge.switchBridgeDirection(Layer.L1, false)
    bridge.switchNetworkType(
      EthereumGoerliInfo.networkAbbreviation,
      true, // is testnet
      false // is a new network
    )
    bridge.switchBridgeDirection(Layer.L2, true) // change to false after incorporating previous test
  })
  it('Use Fee Switcher to switch fee to BOBA', () => {
    bridge.header.getFeeSwitcher().contains('ETH').should('exist').click()
    bridge.header.getFeeSwitcher().contains('BOBA').should('exist').click()
    bridge.confirmTransactionOnMetamask()
    bridge.header.getFeeSwitcher().contains('BOBA').should('exist')
  })
  it('Use Fee Switcher to switch fee to ETH', () => {
    bridge.header.getFeeSwitcher().contains('BOBA').should('exist').click()
    bridge.header.getFeeSwitcher().contains('ETH').should('exist').click()
    bridge.confirmTransactionOnMetamask()
    bridge.header.getFeeSwitcher().contains('ETH').should('exist')
  })
  it('Fee switcher should disapear when switching to BNB', () => {
    bridge.switchBridgeDirection(Layer.L1, false)
    bridge.openNetworkModal(EthereumGoerliInfo.networkName)
    bridge.selectNetworkFromModal(BinanceTestnetInfo.networkName)
    bridge.header.getFeeSwitcher().should('not.exist')
  }) // try to keep this

  after(() => {
    bridge.disconnectWallet()
  })
})

/**
 * Todo:
 * - Make a method to get the fee switcher and it's contents
 */
