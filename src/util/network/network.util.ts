import { BigNumberish, providers } from 'ethers'

import EthereumIcon from 'components/icons/chain/L1/EthereumIcon'
import BNBIcon from 'components/icons/chain/L1/BNBIcon'

import BobaIcon from 'components/icons/chain/L2/BobaIcon'
import BobaBNBIcon from 'components/icons/chain/L2/BobaBNBIcon'

import { ethereumConfig } from './config/ethereum'
import { bnbConfig } from './config/bnb'
import { Layer, LAYER } from 'util/constant'
import {
  NetworkDetail,
  NetworkDetailChainConfig,
} from './config/network-details.types'

export const L1_ICONS = {
  ethereum: EthereumIcon,
  bnb: BNBIcon,
}

export const L2_ICONS = {
  ethereum: BobaIcon,
  bnb: BobaBNBIcon,
}

export enum NetworkType {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
}

export enum Network {
  ETHEREUM = 'ETHEREUM',
  BNB = 'BNB',
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
}

export const NetworkList: { Mainnet: INetwork[]; Testnet: INetwork[] } = {
  Mainnet: [
    {
      icon: 'ethereum',
      chain: Network.ETHEREUM,
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
  ],
}

export const AllNetworkConfigs: { [network in Network]: NetworkDetail } = {
  [Network.ETHEREUM]: ethereumConfig,
  [Network.BNB]: bnbConfig,
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

export const getBlockExplorerUrl = ({ network, networkType, layer }) => {
  return AllNetworkConfigs?.[network]?.[networkType]?.[layer]?.blockExplorerUrl
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
