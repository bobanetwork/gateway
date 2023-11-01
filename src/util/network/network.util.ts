import { BigNumberish, providers } from 'ethers'

import EthereumIcon from 'components/icons/chain/L1/EthereumIcon'
import BNBIcon from 'components/icons/chain/L1/BNBIcon'
import AvalancheIcon from 'components/icons/chain/L1/AvalancheIcon'

import BobaIcon from 'components/icons/chain/L2/BobaIcon'
import BobaBNBIcon from 'components/icons/chain/L2/BobaBNBIcon'
import BobaAvaxIcon from 'components/icons/chain/L2/BobaAvaxIcon'
import OptimismIcon from 'components/icons/chain/L2/OptimismIcon'
import ArbitrumIcon from 'components/icons/chain/L2/ArbitrumIcon'

import { ethereumConfig } from './config/ethereum'
import { bnbConfig } from './config/bnb'
import { avaxConfig } from './config/avax'
import { optimismConfig } from './config/optimism'
import { arbitrumConfig } from './config/arbitrum'
import { Layer, LAYER } from 'util/constant'

export const L1_ICONS = {
  ethereum: EthereumIcon,
  bnb: BNBIcon,
  avax: AvalancheIcon,
  optimism: EthereumIcon,
  arbitrum: EthereumIcon,
}

export const L2_ICONS = {
  ethereum: BobaIcon,
  bnb: BobaBNBIcon,
  avax: BobaAvaxIcon,
  optimism: OptimismIcon,
  arbitrum: ArbitrumIcon,
}

export const NETWORK_TYPE = {
  MAINNET: 'Mainnet',
  TESTNET: 'Testnet',
}

export const NETWORK = {
  ETHEREUM: 'ETHEREUM',
  BNB: 'BNB',
  AVAX: 'AVAX',
  OPTIMISM: 'OPTIMISM',
  ARBITRUM: 'ARBITRUM',
}

export const CHAIN_ID_LIST = {
  5: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.ETHEREUM,
    layer: LAYER.L1,
    name: 'Goerli',
    icon: 'ethereum',
  },
  2888: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.ETHEREUM,
    layer: LAYER.L2,
    name: 'Boba Goerli',
    icon: 'ethereum',
  },
  1: {
    networkType: NETWORK_TYPE.MAINNET,
    chain: NETWORK.ETHEREUM,
    layer: LAYER.L1,
    name: 'Ethereum',
    icon: 'ethereum',
  },
  288: {
    networkType: NETWORK_TYPE.MAINNET,
    chain: NETWORK.ETHEREUM,
    layer: LAYER.L2,
    name: 'Boba Eth',
    icon: 'ethereum',
  },
  // TODO: Remove Avax once down
  43113: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.AVAX,
    layer: LAYER.L1,
    name: 'Fuji',
    icon: 'avax',
  },
  4328: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.AVAX,
    layer: LAYER.L2,
    name: 'Boba Fuji',
    icon: 'avax',
  },
  43114: {
    networkType: NETWORK_TYPE.MAINNET,
    chain: NETWORK.AVAX,
    layer: LAYER.L1,
    name: 'Avax',
    icon: 'avax',
  },
  43288: {
    networkType: NETWORK_TYPE.MAINNET,
    chain: NETWORK.AVAX,
    layer: LAYER.L2,
    name: 'Boba Avax',
    icon: 'avax',
  },
  97: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.BNB,
    layer: LAYER.L1,
    name: 'Bnb Testnet',
    icon: 'bnb',
  },
  9728: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.BNB,
    layer: LAYER.L2,
    name: 'Boba Bnb Testnet',
    icon: 'bnb',
  },
  56: {
    networkType: NETWORK_TYPE.MAINNET,
    chain: NETWORK.BNB,
    layer: LAYER.L1,
    name: 'Bnb',
    icon: 'bnb',
  },
  56288: {
    networkType: NETWORK_TYPE.MAINNET,
    chain: NETWORK.BNB,
    layer: LAYER.L2,
    name: 'Boba Bnb',
    icon: 'bnb',
  },
  420: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.OPTIMISM,
    layer: LAYER.L2,
    name: 'Optimism Goerli',
    icon: 'optimism',
    limitedAvailability: true,
  },
  421613: {
    networkType: NETWORK_TYPE.TESTNET,
    chain: NETWORK.ARBITRUM,
    layer: LAYER.L2,
    name: 'Arbitrum Goerli',
    icon: 'arbitrum',
    limitedAvailability: true,
  },
}

export interface INetwork {
  icon: string
  chain: string
  label: string
  key: string
  name: { l1: string; l2: string }
  chainId: { [Layer.L1]: BigNumberish; [Layer.L2]: BigNumberish }
  /// @dev Used for network we only partially support (e.g. OP/ARB for light bridge)
  limitedAvailability?: boolean
}

export const NetworkList: { Mainnet: INetwork[]; Testnet: INetwork[] } = {
  Mainnet: [
    {
      icon: 'ethereum',
      chain: NETWORK.ETHEREUM,
      label: 'Ethereum <> Boba ETH',
      key: 'ethereum',
      name: {
        l1: 'Ethereum',
        l2: 'Boba ETH',
      },
      chainId: { [Layer.L1]: '1', [Layer.L2]: '288' },
    },
    {
      icon: 'bnb',
      chain: NETWORK.BNB,
      label: 'BNB <> Boba',
      key: 'bnb',
      name: {
        l1: 'Binance Smart Chain',
        l2: 'Boba BNB',
      },
      chainId: { [Layer.L1]: '56', [Layer.L2]: '56288' },
    },
    {
      icon: 'avax',
      chain: NETWORK.AVAX,
      label: 'Avalanche <> Boba',
      key: 'avax',
      name: {
        l1: 'Avalanche Mainnet C-Chain',
        l2: 'Boba Avalanche',
      },
      chainId: { [Layer.L1]: '43114', [Layer.L2]: '43288' },
    },
  ],
  Testnet: [
    {
      icon: 'ethereum',
      chain: NETWORK.ETHEREUM,
      label: 'Ethereum (Goerli) <> Boba (Goerli)',
      key: 'ethereum',
      name: {
        l1: 'Ethereum (Goerli)',
        l2: 'Boba (Goerli)',
      },
      chainId: { [Layer.L1]: '5', [Layer.L2]: '2888' },
    },
    {
      icon: 'bnb',
      chain: NETWORK.BNB,
      label: 'BNB (Testnet) <> Boba',
      key: 'bnb',
      name: {
        l1: 'BNB Testnet',
        l2: 'Boba BNB Testnet',
      },
      chainId: { [Layer.L1]: '97', [Layer.L2]: '9728' },
    },
    {
      icon: 'avax',
      chain: NETWORK.AVAX,
      label: 'Fuji (Testnet) <> Boba',
      key: 'avax',
      name: {
        l1: 'Fuji Testnet',
        l2: 'Boba Fuji Testnet',
      },
      chainId: { [Layer.L1]: '43113', [Layer.L2]: '4328' },
    },
    // TODO Make sure they are only shown for light bridge
    {
      icon: 'optimism',
      chain: NETWORK.OPTIMISM,
      label: 'Ethereum (Goerli) <> Optimism (Goerli)',
      key: 'optimism',
      name: {
        l1: 'Ethereum (Goerli)',
        l2: 'Optimism (Goerli)',
      },
      chainId: { [Layer.L1]: '5', [Layer.L2]: '420' },
      limitedAvailability: true,
    },
    {
      icon: 'arbitrum',
      chain: NETWORK.ARBITRUM,
      label: 'Ethereum (Goerli) <> Arbitrum (Goerli)',
      key: 'arbitrum',
      name: {
        l1: 'Ethereum (Goerli)',
        l2: 'Arbitrum (Goerli)',
      },
      chainId: { [Layer.L1]: '5', [Layer.L2]: '421613' },
      limitedAvailability: true,
    },
  ],
}

export const networkLimitedAvailability = (
  networkType: keyof typeof NETWORK_TYPE,
  network: keyof typeof NETWORK
) => {
  return !!NetworkList[networkType]?.find((n) => n.chain === network)
    ?.limitedAvailability
}

export const AllNetworkConfigs = {
  [NETWORK.ETHEREUM]: ethereumConfig,
  [NETWORK.BNB]: bnbConfig,
  [NETWORK.AVAX]: avaxConfig,
  [NETWORK.OPTIMISM]: optimismConfig,
  [NETWORK.ARBITRUM]: arbitrumConfig,
}

export const getNetworkDetail = ({ network, networkType }) => {
  return AllNetworkConfigs[network][networkType]
}

export const getRpcUrlByChainId = (chainId): string => {
  const network = CHAIN_ID_LIST[chainId]
  return getRpcUrl({
    network: network.chain,
    layer: network.layer,
    networkType: network.networkType,
  })
}

export const getRpcUrl = ({ network, networkType, layer }): string => {
  const rpcs = AllNetworkConfigs[network][networkType][layer]?.rpcUrl
  let randomRpc = rpcs
  if (Array.isArray(rpcs)) {
    randomRpc = rpcs[Math.floor(Math.random() * rpcs.length)]
  }
  return randomRpc
}

export const pingRpcUrl = async (rpcUrl) => {
  const provider = new providers.JsonRpcProvider(rpcUrl)
  try {
    await provider.getBlockNumber()
    return true
  } catch (e) {
    console.log(`Error pinging Rpc Url: ${rpcUrl}`)
    return false
  }
}
