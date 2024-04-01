import AllNetworksIcon from 'assets/images/allNetworks.svg'
import { IDropdownItem } from 'components/global/dropdown'
import { IFilterDropdownItem } from 'components/filter'
import { TableHeaderOptionType } from 'components/global/table'
import { getCoinImage } from 'util/coinImage'
import { NetworkType } from 'util/network/network.util'
import { CHAIN_NAME, ChainMap } from './types'

import bobaEth from 'assets/bobaEth.svg'
import bobaBnb from 'assets/bobaBNB.svg'
import optimism from 'assets/optimism.svg'
import arbitrum from 'assets/arbitrum.svg'

import ethIcon from 'assets/ethereum.svg'

export const Chains: ChainMap = {
  '0': {
    name: CHAIN_NAME.All_Networks,
    transactionUrlPrefix: '',
    symbol: '',
    imgSrc: ethIcon,
  },
  '56': {
    name: CHAIN_NAME.BNB,
    transactionUrlPrefix: 'https://bscscan.com/tx/',
    symbol: 'BNB',
    imgSrc: getCoinImage('BNB'),
  },
  '56288': {
    name: CHAIN_NAME.Boba_BNB,
    transactionUrlPrefix: 'https://blockexplorer.bnb.boba.network/tx/',
    symbol: 'BOBA',
    imgSrc: bobaBnb,
  },
  '97': {
    name: CHAIN_NAME.BNB_Testnet,
    transactionUrlPrefix: 'https://testnet.bscscan.com/tx/',
    symbol: 'BNB',
    imgSrc: getCoinImage('BNB'),
  },
  '9728': {
    name: CHAIN_NAME.Boba_BNB_Testnet,
    transactionUrlPrefix: 'https://blockexplorer.testnet.bnb.boba.network/tx/',
    symbol: 'BOBA',
    imgSrc: bobaBnb,
  },
  '1': {
    name: CHAIN_NAME.Ethereum,
    transactionUrlPrefix: 'https://etherscan.io/tx/',
    symbol: 'ETH',
    imgSrc: ethIcon,
  },
  // 900 & 901 are local chainIds, 900 (L1), 901 (L2)
  '900': {
    name: CHAIN_NAME.Boba_Ethereum,
    transactionUrlPrefix: 'https://bobascan.com/tx/',
    symbol: 'ETH',
    imgSrc: ethIcon,
  },
  '901': {
    name: CHAIN_NAME.Boba_Goerli,
    transactionUrlPrefix: 'https://bobascan.com/tx/',
    symbol: 'BOBA',
    imgSrc: bobaEth,
  },
  '288': {
    name: CHAIN_NAME.Boba_Ethereum,
    transactionUrlPrefix: 'https://bobascan.com/tx/',
    symbol: 'BOBA',
    imgSrc: bobaEth,
  },
  '5': {
    name: CHAIN_NAME.Goerli,
    transactionUrlPrefix: 'https://goerli.etherscan.io/tx/',
    symbol: 'ETH',
    imgSrc: ethIcon,
  },
  '2888': {
    name: CHAIN_NAME.Boba_Goerli,
    transactionUrlPrefix: 'https://testnet.bobascan.com/tx/',
    symbol: 'BOBA',
    imgSrc: bobaEth,
  },
  '420': {
    name: CHAIN_NAME.Optimism_Goerli,
    transactionUrlPrefix: 'https://goerli-optimism.etherscan.io/tx/',
    symbol: 'ETH',
    imgSrc: optimism,
  },
  '421613': {
    name: CHAIN_NAME.Arbitrum_Goerli,
    transactionUrlPrefix: 'https://goerli.arbiscan.io/tx/',
    symbol: 'ETH',
    imgSrc: arbitrum,
  },
  '11155111': {
    name: CHAIN_NAME.Sepolia,
    transactionUrlPrefix: 'https://sepolia.etherscan.io/tx/',
    symbol: 'ETH',
    imgSrc: ethIcon,
  },
  '28882': {
    name: CHAIN_NAME.Boba_Sepolia,
    transactionUrlPrefix: 'https://testnet.bobascan.com/tx/',
    symbol: 'ETH',
    imgSrc: bobaEth,
  },
}

export const ALL_NETWORKS: IDropdownItem = {
  value: '0',
  label: 'All Networks',
  imgSrc: AllNetworksIcon,
  header: false,
  headerName: '',
}
export const NETWORK_L1_OPTIONS: IDropdownItem[] = [
  ALL_NETWORKS,
  {
    value: '1',
    label: 'Ethereum',
    imgSrc: ethIcon,
    headerName: NetworkType.MAINNET,
  },
  {
    value: '56',
    label: 'BNB',
    imgSrc: getCoinImage('BNB'),
    headerName: NetworkType.MAINNET,
  },
  {
    value: '5',
    label: 'Goerli',
    imgSrc: ethIcon,
    headerName: NetworkType.TESTNET,
  },
  {
    value: '11155111',
    label: 'Sepolia',
    imgSrc: ethIcon,
    headerName: NetworkType.TESTNET,
  },
]

export const NETWORK_L2_OPTIONS = [
  ALL_NETWORKS,
  {
    value: '288',
    label: 'Boba Ethereum',
    imgSrc: bobaEth,
    headerName: NetworkType.MAINNET,
  },
  {
    value: '56288',
    label: 'Boba BNB',
    imgSrc: bobaBnb,
    headerName: NetworkType.MAINNET,
  },
  {
    value: '2888',
    label: 'Boba Goerli',
    imgSrc: bobaEth,
    headerName: NetworkType.TESTNET,
  },
  {
    value: '28882',
    label: 'Boba Sepolia',
    imgSrc: bobaEth,
    headerName: NetworkType.TESTNET,
  },
  {
    value: '9728',
    label: 'Boba tBNB',
    imgSrc: bobaBnb,
    headerName: NetworkType.TESTNET,
  },
  {
    value: '420',
    label: 'Optimism Goerli',
    imgSrc: optimism,
    headerName: NetworkType.TESTNET,
  },
  {
    value: '421613',
    label: 'Arbitrum Goerli',
    imgSrc: arbitrum,
    headerName: NetworkType.TESTNET,
  },
  {
    value: '10',
    label: 'Optimism',
    imgSrc: optimism,
    headerName: NetworkType.MAINNET,
  },
  {
    value: '42161',
    label: 'Arbitrum',
    imgSrc: arbitrum,
    headerName: NetworkType.MAINNET,
  },
]

export const FILTER_OPTIONS: IFilterDropdownItem[] = [
  { value: 'All', label: 'All Status' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Canceled', label: 'Canceled' },
]

export const TableOptions: TableHeaderOptionType[] = [
  {
    name: 'Date',
    width: 168,
    tooltip: '',
  },
  {
    name: 'From',
    width: 142,
    tooltip: '',
  },
  {
    name: 'To',
    width: 142,
    tooltip: '',
  },
  {
    name: 'Token',
    width: 90,
    tooltip: '',
  },
  { name: 'Amount', width: 80, tooltip: '' },
  { name: 'Status', width: 88, tooltip: '' },
]
