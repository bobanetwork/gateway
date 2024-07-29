import React from 'react'
import { Navigate } from 'react-router-dom'

import { ROUTES_PATH } from 'util/constant'

const Bridging = React.lazy(() => import('containers/Bridging'))
const OldDao = React.lazy(() => import('containers/dao/OldDao'))
const Earn = React.lazy(() => import('containers/earn/Earn'))
const Home = React.lazy(() => import('containers/home'))
const SaveWrapper = React.lazy(() => import('containers/save/SaveWrapper'))
const History = React.lazy(() => import('containers/history/History'))

export const COMMON_ROUTES = [
  {
    path: '*',
    element: <Navigate to={ROUTES_PATH.BRIDGE} />,
    key: '',
  },
]

export interface IRoute {
  path: string
  children: {
    path: string
    key: string
    element: React.JSX.Element
    disable?: boolean
  }[]
  element: React.JSX.Element
}

export const ROUTE_LIST: IRoute[] = [
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: ROUTES_PATH.BRIDGE,
        element: <Bridging />,
        key: 'Bridge',
      },
      {
        path: ROUTES_PATH.HISTORY,
        element: <History />,
        key: 'History',
      },
      {
        path: ROUTES_PATH.EARN,
        element: <Earn />,
        key: 'Earn',
      },
      {
        path: ROUTES_PATH.STAKE,
        element: <SaveWrapper />,
        key: 'Stake',
      },
      {
        path: ROUTES_PATH.DAO,
        element: <OldDao />,
        key: 'DAO',
      },
    ],
  },
]
