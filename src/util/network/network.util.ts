import { BigNumberish, providers } from 'ethers'

import EthereumIcon from 'components/icons/chain/L1/EthereumIcon'
import BNBIcon from 'components/icons/chain/L1/BNBIcon'
import AvalancheIcon from 'components/icons/chain/L1/AvalancheIcon'

import BobaIcon from 'components/icons/chain/L2/BobaIcon'
import BobaBNBIcon from 'components/icons/chain/L2/BobaBNBIcon'
import BobaAvaxIcon from 'components/icons/chain/L2/BobaAvaxIcon'

import { ethereumConfig } from './config/ethereum'
import { bnbConfig } from './config/bnb'
import { avaxConfig } from './config/avax'
import { Layer, LAYER } from 'util/constant'

export const L1_ICONS = {
  ethereum: EthereumIcon,
  bnb: BNBIcon,
  avax: AvalancheIcon,
}

export const L2_ICONS = {
  ethereum: BobaIcon,
  bnb: BobaBNBIcon,
  avax: BobaAvaxIcon,
}

export enum NetworkType {
  MAINNET = 'Mainnet',
  TESTNET = 'Testnet',
}

export enum Network {
  ETHEREUM = 'ETHEREUM',
  BNB = 'BNB',
  AVAX = 'AVAX',
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
  // TODO: Remove Avax once down
  43113: {
    networkType: NetworkType.TESTNET,
    chain: Network.AVAX,
    layer: LAYER.L1,
    name: 'Fuji',
    icon: 'avax',
  },
  4328: {
    networkType: NetworkType.TESTNET,
    chain: Network.AVAX,
    layer: LAYER.L2,
    name: 'Boba Fuji',
    icon: 'avax',
  },
  43114: {
    networkType: NetworkType.MAINNET,
    chain: Network.AVAX,
    layer: LAYER.L1,
    name: 'Avax',
    icon: 'avax',
  },
  43288: {
    networkType: NetworkType.MAINNET,
    chain: Network.AVAX,
    layer: LAYER.L2,
    name: 'Boba Avax',
    icon: 'avax',
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
    {
      icon: 'avax',
      chain: Network.AVAX,
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
    {
      icon: 'avax',
      chain: Network.AVAX,
      label: 'Fuji (Testnet) <> Boba',
      key: 'avax',
      name: {
        l1: 'Fuji Testnet',
        l2: 'Boba Fuji Testnet',
      },
      chainId: { [Layer.L1]: '43113', [Layer.L2]: '4328' },
    },
  ],
}

export const AllNetworkConfigs = {
  [Network.ETHEREUM]: ethereumConfig,
  [Network.BNB]: bnbConfig,
  [Network.AVAX]: avaxConfig,
}

export const getNetworkDetail = ({
  network,
  networkType,
}: INetworkCategory) => {
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
