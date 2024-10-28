/**************
 * Env Params *
 **************/
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()

export type EnvType = string | number | null | undefined

export const POLL_INTERVAL: EnvType =
  process.env.REACT_APP_POLL_INTERVAL || 20000
export const GAS_POLL_INTERVAL: EnvType =
  process.env.REACT_APP_GAS_POLL_INTERVAL || 40000
export const GA4_MEASUREMENT_ID: EnvType =
  process.env.REACT_APP_GA4_MEASUREMENT_ID || null
export const APP_ENV: EnvType = process.env.REACT_APP_ENV || 'dev'
export const WALLET_VERSION: EnvType = process.env.REACT_APP_WALLET_VERSION
export const WC_PROJECT_ID: EnvType = process.env.REACT_APP_WC_PROJECT_ID
// WalletConnect FLAG
export const DISABLE_WALLETCONNECT: EnvType =
  process.env.REACT_APP_DISABLE_WALLETCONNECT

const GATEWAY_DATA_BRANCH: EnvType =
  process.env.REACT_APP_GATEWAY_DATA_BRANCH || 'main'

/*********************
 * Routes Constants **
 *********************/

type RoutesPathType = {
  BRIDGE: string
  HISTORY: string
  EARN: string
  STAKE: string
  DAO: string
  ECOSYSTEM: string
  TRADE: string
}

export const ROUTES_PATH: RoutesPathType = {
  BRIDGE: '/bridge',
  HISTORY: '/history',
  EARN: '/earn',
  STAKE: '/stake',
  DAO: '/dao',
  ECOSYSTEM: '/ecosystem',
  TRADE: '/trade',
}

type Network = 'ethereum' | 'bnb' | 'optimism' | 'arbitrum'
type Page =
  | 'Bridge'
  | 'History'
  | 'Earn'
  | 'Stake'
  | 'DAO'
  | 'trade'
  | 'ecosystem'
type PagesByNetworkType = Record<Network, Page[]>

export const PAGES_BY_NETWORK: PagesByNetworkType = {
  ethereum: ['Bridge', 'History', 'Earn', 'Stake', 'DAO', 'ecosystem', 'trade'],
  bnb: ['Bridge', 'Earn', 'History', 'ecosystem', 'trade'],
  optimism: ['Bridge', 'History', 'ecosystem', 'trade'],
  arbitrum: ['Bridge', 'History', 'ecosystem', 'trade'],
}

export enum Layer {
  L1 = 'L1',
  L2 = 'L2',
}

export const LAYER: { [key: string]: Layer } = Layer

type NetworkIconType = 'ethereum' | 'boba'

type NetworkNameType = {
  L1: string
  L2: string
}

type DefaultNetworkType = {
  NAME: NetworkNameType
  ICON: Record<Layer, NetworkIconType>
}

export const DEFAULT_NETWORK: DefaultNetworkType = {
  NAME: {
    L1: 'Ethereum',
    L2: 'Boba ETH',
  },
  ICON: {
    L1: 'ethereum',
    L2: 'boba',
  },
}

export const MM_EXTENTION_URL: string =
  'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'

export const MIN_NATIVE_L1_BALANCE: number = 0.002

export const THIRD_PARTY_BRIDGES_LIST = `https://raw.githubusercontent.com/bobanetwork/gateway-data/${GATEWAY_DATA_BRANCH}/bridges/list.json`

export const COIN_GECKO_URL = `https://api.coingecko.com/api/v3/`

export const ERROR_CODE = 'GATEWAY ERROR:'
