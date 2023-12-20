import { BigNumberish, providers } from 'ethers'

import EthereumIcon from 'components/icons/chain/L1/EthereumIcon'
import BNBIcon from 'components/icons/chain/L1/BNBIcon'

import BobaIcon from 'components/icons/chain/L2/BobaIcon'
import BobaBNBIcon from 'components/icons/chain/L2/BobaBNBIcon'
import OptimismIcon from 'components/icons/chain/L2/OptimismIcon'
import ArbitrumIcon from 'components/icons/chain/L2/ArbitrumIcon'

import { ethereumConfig } from './config/ethereum'
import { bnbConfig } from './config/bnb'
import { optimismConfig } from './config/optimism'
import { arbitrumConfig } from './config/arbitrum'
import { Layer, LAYER } from 'util/constant'
import {
  NetworkDetail,
  NetworkDetailChainConfig,
} from './config/network-details.types'

export const L1_ICONS = {
  ethereum: EthereumIcon,
  bnb: BNBIcon,
  optimism: EthereumIcon,
  arbitrum: EthereumIcon,
}

export const L2_ICONS = {
  ethereum: BobaIcon,
  bnb: BobaBNBIcon,
  optimism: OptimismIcon,
  arbitrum: ArbitrumIcon,
}

export enum NetworkType {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
}

export enum Network {
  ETHEREUM = 'ETHEREUM',
  BNB = 'BNB',
  OPTIMISM = 'OPTIMISM',
  ARBITRUM = 'ARBITRUM',
}

export const CHAIN_ID_LIST = {
  5: {
    networkType: NetworkType.TESTNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L1,
    name: 'Goerli',
    icon: 'ethereum',
  },
  2888: {
    networkType: NetworkType.TESTNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L2,
    name: 'Boba Goerli',
    icon: 'ethereum',
  },
  1: {
    networkType: NetworkType.MAINNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L1,
    name: 'Ethereum',
    icon: 'ethereum',
  },
  288: {
    networkType: NetworkType.MAINNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L2,
    name: 'Boba Eth',
    icon: 'ethereum',
  },
  97: {
    networkType: NetworkType.TESTNET,
    chain: Network.BNB,
    layer: LAYER.L1,
    name: 'Bnb Testnet',
    icon: 'bnb',
  },
  9728: {
    networkType: NetworkType.TESTNET,
    chain: Network.BNB,
    layer: LAYER.L2,
    name: 'Boba Bnb Testnet',
    icon: 'bnb',
  },
  56: {
    networkType: NetworkType.MAINNET,
    chain: Network.BNB,
    layer: LAYER.L1,
    name: 'Bnb',
    icon: 'bnb',
  },
  56288: {
    networkType: NetworkType.MAINNET,
    chain: Network.BNB,
    layer: LAYER.L2,
    name: 'Boba Bnb',
    icon: 'bnb',
  },
  420: {
    networkType: NetworkType.TESTNET,
    chain: Network.OPTIMISM,
    layer: LAYER.L2,
    name: 'Optimism Goerli',
    icon: 'optimism',
    limitedAvailability: true,
  },
  421613: {
    networkType: NetworkType.TESTNET,
    chain: Network.ARBITRUM,
    layer: LAYER.L2,
    name: 'Arbitrum Goerli',
    icon: 'arbitrum',
    limitedAvailability: true,
  },
  10: {
    networkType: NetworkType.MAINNET,
    chain: Network.OPTIMISM,
    layer: LAYER.L2,
    name: 'Optimism Mainnet',
    icon: 'optimism',
    limitedAvailability: true,
  },
  42161: {
    networkType: NetworkType.MAINNET,
    chain: Network.ARBITRUM,
    layer: LAYER.L2,
    name: 'Arbitrum Mainnet',
    icon: 'arbitrum',
    limitedAvailability: true,
  },
}

export interface INetworkCategory {
  network: Network
  networkType: NetworkType
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

export const DEFAULT_NETWORK = {
  icon: 'ethereum',
  chain: Network.ETHEREUM,
  label: 'Ethereum <> Boba ETH',
  key: 'ethereum',
  name: {
    l1: 'Ethereum',
    l2: 'Boba ETH',
  },
  chainId: { [Layer.L1]: '1', [Layer.L2]: '288' },
}
export const NetworkList: { Mainnet: INetwork[]; Testnet: INetwork[] } = {
  Mainnet: [
    DEFAULT_NETWORK,
    {
      icon: 'bnb',
      chain: Network.BNB,
      label: 'BNB <> Boba',
      key: 'bnb',
      name: {
        l1: 'Binance Smart Chain',
        l2: 'Boba BNB',
      },
      chainId: { [Layer.L1]: '56', [Layer.L2]: '56288' },
    },
  ],
  Testnet: [
    {
      icon: 'ethereum',
      chain: Network.ETHEREUM,
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
      chain: Network.BNB,
      label: 'BNB (Testnet) <> Boba',
      key: 'bnb',
      name: {
        l1: 'BNB Testnet',
        l2: 'Boba BNB Testnet',
      },
      chainId: { [Layer.L1]: '97', [Layer.L2]: '9728' },
    },
    // TODO Make sure they are only shown for light bridge
    {
      icon: 'optimism',
      chain: Network.OPTIMISM,
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
      chain: Network.ARBITRUM,
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
  networkType: keyof typeof NetworkType,
  network: keyof typeof Network
) => {
  const currNetwork = NetworkList[networkType ?? NetworkType.TESTNET]
  return !!currNetwork?.find((n) => n.chain === network)?.limitedAvailability
}

export const AllNetworkConfigs: { [network in Network]: NetworkDetail } = {
  [Network.ETHEREUM]: ethereumConfig,
  [Network.BNB]: bnbConfig,
  [Network.OPTIMISM]: optimismConfig,
  [Network.ARBITRUM]: arbitrumConfig,
}

export const getNetworkDetail = ({
  network,
  networkType,
}: INetworkCategory): NetworkDetailChainConfig => {
  return AllNetworkConfigs?.[network]?.[networkType]
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
