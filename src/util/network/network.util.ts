import { BigNumberish, providers } from 'ethers'

import EthereumIcon from 'components/icons/chain/L1/EthereumIcon'
import BNBIcon from 'components/icons/chain/L1/BNBIcon'

import BobaIcon from 'components/icons/chain/L2/BobaIcon'
import BobaBNBIcon from 'components/icons/chain/L2/BobaBNBIcon'
import OptimismIcon from 'components/icons/chain/L2/OptimismIcon'
import ArbitrumIcon from 'components/icons/chain/L2/ArbitrumIcon'
import bobaEth from 'assets/bobaEth.svg'
import bobaBnb from 'assets/bobaBNB.svg'
import optimism from 'assets/optimism.svg'
import arbitrum from 'assets/arbitrum.svg'

import ethIcon from 'assets/ethereum.svg'

import { sepoliaConfig } from './config/ethereumSepolia'
import { ethereumConfig } from './config/ethereum'
import { bnbConfig } from './config/bnb'
import { optimismConfig } from './config/optimism'
import { arbitrumConfig } from './config/arbitrum'
import { Layer, LAYER } from 'util/constant'
import {
  NetworkDetail,
  NetworkDetailChainConfig,
} from './config/network-details.types'
import { getCoinImage } from 'util/coinImage'

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
  ETHEREUM_SEPOLIA = 'ETHEREUM_SEPOLIA',
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
    siteName: 'Ethereum (Goerli)',
    imgSrc: ethIcon,
  },
  2888: {
    networkType: NetworkType.TESTNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L2,
    name: 'Boba Goerli',
    icon: 'ethereum',
    siteName: 'Boba (Goerli)',
    imgSrc: bobaEth,
  },
  28882: {
    networkType: NetworkType.TESTNET,
    chain: Network.ETHEREUM_SEPOLIA,
    layer: LAYER.L2,
    name: 'Boba Sepolia',
    icon: 'ethereum',
    siteName: 'Boba (Sepolia)',
    imgSrc: bobaEth,
  },
  11155111: {
    networkType: NetworkType.TESTNET,
    chain: Network.ETHEREUM_SEPOLIA,
    layer: LAYER.L2,
    name: 'Sepolia',
    icon: 'ethereum',
    siteName: 'Ethereum (Sepolia)',
    imgSrc: ethIcon,
  },
  1: {
    networkType: NetworkType.MAINNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L1,
    name: 'Ethereum',
    icon: 'ethereum',
    siteName: 'Ethereum',
    imgSrc: ethIcon,
  },
  288: {
    networkType: NetworkType.MAINNET,
    chain: Network.ETHEREUM,
    layer: LAYER.L2,
    name: 'Boba Eth',
    icon: 'ethereum',
    siteName: 'Boba ETH',
    imgSrc: bobaEth,
  },
  97: {
    networkType: NetworkType.TESTNET,
    chain: Network.BNB,
    layer: LAYER.L1,
    name: 'Bnb Testnet',
    icon: 'bnb',
    siteName: 'BNB Testnet',
    imgSrc: getCoinImage('BNB'),
  },
  9728: {
    networkType: NetworkType.TESTNET,
    chain: Network.BNB,
    layer: LAYER.L2,
    name: 'Boba Bnb Testnet',
    icon: 'bnb',
    siteName: 'Boba BNB Testnet',
    imgSrc: bobaBnb,
  },
  56: {
    networkType: NetworkType.MAINNET,
    chain: Network.BNB,
    layer: LAYER.L1,
    name: 'Bnb',
    icon: 'bnb',
    siteName: 'Binance Smart Chain',
    imgSrc: getCoinImage('BNB'),
  },
  56288: {
    networkType: NetworkType.MAINNET,
    chain: Network.BNB,
    layer: LAYER.L2,
    name: 'Boba Bnb',
    icon: 'bnb',
    siteName: 'Boba BNB',
    imgSrc: bobaBnb,
  },
  420: {
    networkType: NetworkType.TESTNET,
    chain: Network.OPTIMISM,
    layer: LAYER.L2,
    name: 'Optimism Goerli',
    icon: 'optimism',
    siteName: 'Optimism (Goerli)',
    limitedAvailability: true,
    imgSrc: optimism,
  },
  421613: {
    networkType: NetworkType.TESTNET,
    chain: Network.ARBITRUM,
    layer: LAYER.L2,
    name: 'Arbitrum Goerli',
    icon: 'arbitrum',
    siteName: 'Arbitrum (Goerli)',
    limitedAvailability: true,
    imgSrc: arbitrum,
  },
  10: {
    networkType: NetworkType.MAINNET,
    chain: Network.OPTIMISM,
    layer: LAYER.L2,
    name: 'Optimism Mainnet',
    icon: 'optimism',
    siteName: 'Optimism',
    limitedAvailability: true,
    imgSrc: optimism,
  },
  42161: {
    networkType: NetworkType.MAINNET,
    chain: Network.ARBITRUM,
    layer: LAYER.L2,
    name: 'Arbitrum Mainnet',
    icon: 'arbitrum',
    siteName: 'Arbitrum',
    limitedAvailability: true,
    imgSrc: arbitrum,
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
type NetworkLists = {
  Mainnet: INetwork[]
  Testnet: INetwork[]
}

export const NetworkList: NetworkLists = {
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
      chain: Network.ETHEREUM_SEPOLIA,
      label: 'Ethereum (Sepolia) <> Boba (Sepolia)',
      key: 'ethereum',
      name: {
        l1: 'Ethereum (Sepolia)',
        l2: 'Boba (Sepolia)',
      },
      chainId: { [Layer.L1]: '11155111', [Layer.L2]: '28882' },
      limitedAvailability: false,
    },
    {
      //@todo remove on full migration to sepolia.
      icon: 'ethereum',
      chain: Network.ETHEREUM,
      label: 'Ethereum (Goerli) <> Boba (Goerli)',
      key: 'ethereum',
      name: {
        l1: 'Ethereum (Goerli)',
        l2: 'Boba (Goerli)',
      },
      chainId: { [Layer.L1]: '5', [Layer.L2]: '2888' },
      limitedAvailability: false,
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
    // Make sure they are only shown for light bridge
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
  [Network.ETHEREUM_SEPOLIA]: sepoliaConfig,
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

export const chainNameMaps: Record<Network, string> = {
  ETHEREUM: 'Ethereum',
  ETHEREUM_SEPOLIA: 'Ethereum Sepolia',
  BNB: 'Bnb',
  OPTIMISM: 'Optimism',
  ARBITRUM: 'Arbitrum',
}
