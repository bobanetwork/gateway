import { LAYER } from 'util/constant'
import { Network, NetworkType } from 'util/network/network.util'

export const MOCK_CHAIN_LIST = {
  88: {
    networkType: NetworkType.TESTNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L1,
    name: 'ETH Seplia',
    icon: 'ethereum',
    siteName: 'ETH (Sepolia)',
    imgSrc: 'eth',
  },
  99: {
    networkType: NetworkType.TESTNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L2,
    name: 'Boba Sepolia',
    icon: 'ethereum',
    siteName: 'Boba (Sepolia)',
    imgSrc: 'bobaEth',
  },
}
