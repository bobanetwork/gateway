import { optimismConfig } from '../network/config/optimism'
import {
  AllNetworkConfigs,
  CHAIN_ID_LIST,
  L1_ICONS,
  L2_ICONS,
  Network,
  NetworkType,
  NetworkList,
} from '../network/network.util'
import { arbitrumConfig } from '../network/config/arbitrum'
import { PAGES_BY_NETWORK } from '../constant'

describe('OP/ARB network configuration', () => {
  it('should define optimism configuration', () => {
    const config = optimismConfig
    expect(config.Mainnet.L1.chainId).toEqual(1)
    expect(config.Mainnet.L2.chainId).toEqual(10)
    expect(config.Mainnet.L1.chainIdHex).toEqual('0x1')
    expect(config.Mainnet.L2.chainIdHex).toEqual('0xA')
    expect(config.Testnet.L1.chainId).toEqual(5)
    expect(config.Testnet.L2.chainId).toEqual(420)
    expect(config.Testnet.L1.chainIdHex).toEqual('0x5')
    expect(config.Testnet.L2.chainIdHex).toEqual('0x1A4')
  })

  it('should define arbitrum configuration', () => {
    const config = arbitrumConfig
    expect(config.Mainnet.L1.chainId).toEqual(1)
    expect(config.Mainnet.L2.chainId).toEqual(42161)
    expect(config.Mainnet.L1.chainIdHex).toEqual('0x1')
    expect(config.Mainnet.L2.chainIdHex).toEqual('0xA4B1')
    expect(config.Testnet.L1.chainId).toEqual(5)
    expect(config.Testnet.L2.chainId).toEqual(421614)
    expect(config.Testnet.L1.chainIdHex).toEqual('0x11155111')
    expect(config.Testnet.L2.chainIdHex).toEqual('0x66EED')
  })

  it('should list op/arb inside all network configurations', () => {
    const allNetworkConfigs = AllNetworkConfigs
    expect(allNetworkConfigs[Network.OPTIMISM]).toBeDefined()
    expect(allNetworkConfigs[Network.OPTIMISM]).toEqual(optimismConfig)
    expect(allNetworkConfigs[Network.ARBITRUM]).toBeDefined()
    expect(allNetworkConfigs[Network.ARBITRUM]).toEqual(arbitrumConfig)
  })

  it('should contain op/arb inside NetworkList', () => {
    const networkList = NetworkList
    const OP = networkList.Testnet.find(
      (chain) => chain.chain === Network.OPTIMISM
    )
    expect(OP).toBeDefined()
    expect(OP?.chainId.L1).toEqual('11155111')
    expect(OP?.chainId.L2).toEqual('11155420')
    const AR = networkList.Testnet.find(
      (chain) => chain.chain === Network.ARBITRUM
    )
    expect(AR).toBeDefined()
    expect(AR?.chainId.L1).toEqual('11155111')
    expect(AR?.chainId.L2).toEqual('421614')
  })

  it('should contain op/arb inside CHAIN_ID_LIST', () => {
    expect(CHAIN_ID_LIST[11155420].chain).toEqual(Network.OPTIMISM)
    expect(CHAIN_ID_LIST[11155420].networkType).toEqual(NetworkType.TESTNET)
    expect(CHAIN_ID_LIST[421614].chain).toEqual(Network.ARBITRUM)
    expect(CHAIN_ID_LIST[421614].networkType).toEqual(NetworkType.TESTNET)
  })

  it('should list op/arb inside L1/L2 Icons', () => {
    expect(L1_ICONS['optimism']).toBeDefined()
    expect(L2_ICONS['optimism']).toBeDefined()
    expect(L1_ICONS['arbitrum']).toBeDefined()
    expect(L2_ICONS['arbitrum']).toBeDefined()
  })

  it('should set op/arb pages by network only to bridge and history', () => {
    const arbPageBynetwork = PAGES_BY_NETWORK['arbitrum']
    expect(arbPageBynetwork).toContain('Bridge')
    expect(arbPageBynetwork).toContain('History')
    expect(arbPageBynetwork).not.toContain('Earn')
    expect(arbPageBynetwork).not.toContain('Stake')
    const opPageBynetwork = PAGES_BY_NETWORK['optimism']
    expect(opPageBynetwork).toContain('Bridge')
    expect(opPageBynetwork).toContain('History')
    expect(opPageBynetwork).not.toContain('Earn')
    expect(opPageBynetwork).not.toContain('Stake')
  })
})
