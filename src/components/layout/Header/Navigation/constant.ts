import { ROUTES_PATH } from 'util/constant'
import { IMenuItem } from './types'

export const MENU_LIST: Array<IMenuItem> = [
  {
    label: 'Bridge',
    path: ROUTES_PATH.BRIDGE,
  },
  {
    label: 'History',
    path: ROUTES_PATH.HISTORY,
  },
  {
    label: 'Stake',
    path: ROUTES_PATH.STAKE,
  },
  {
    label: 'Dao',
    path: ROUTES_PATH.DAO,
  },
  // {
  //   label: 'Trade',
  //   path: ROUTES_PATH.TRADE,
  // },
  {
    label: 'Ecosystem',
    path: ROUTES_PATH.ECOSYSTEM,
  },
]
