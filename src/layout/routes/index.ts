import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteObject, useRoutes } from 'react-router-dom'
import { selectActiveNetwork, selectNetworkType } from 'selectors'
import { PAGES_BY_NETWORK, ROUTES_PATH } from 'util/constant'
import { intersection } from 'util/lodash'
import { setNetwork } from '../../actions/networkAction'
import {
  Network,
  NetworkList,
  networkLimitedAvailability,
} from '../../util/network/network.util'
import { COMMON_ROUTES, ROUTE_LIST } from './routeList'

export const Router = () => {
  const routeList = ROUTE_LIST
  const [routes, setRoutes] = useState<RouteObject[]>([])
  const dispatch = useDispatch()
  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectNetworkType())

  useEffect(() => {
    const isOnLimitedNetwork = networkLimitedAvailability(networkType, network)
    const childRoutes = routeList[0].children
    const fRoutes = childRoutes.filter(
      (m) =>
        intersection([m.key], PAGES_BY_NETWORK[network.toLowerCase()]).length
    )
    const { path, ...indexRoute } = fRoutes[0]
    const _routes = [
      {
        ...indexRoute,
        index: true,
      },
      ...fRoutes,
      ...COMMON_ROUTES,
    ].filter((r) => !(r as any).disable)

    if (
      isOnLimitedNetwork &&
      routeList[0].path !== '/' &&
      routeList[0].path !== ROUTES_PATH.BRIDGE
    ) {
      const defaultChainDetail = NetworkList[networkType].find(
        (n) => n.chain === Network.ETHEREUM
      )

      // switch network when switching page for limited networks
      dispatch(
        setNetwork({
          network: defaultChainDetail.chain,
          name: defaultChainDetail.name,
          networkIcon: defaultChainDetail.icon,
          chainIds: defaultChainDetail.chainId,
          networkType,
        }) as any
      )
    }

    setRoutes([
      {
        ...routeList[0],
        children: _routes,
      },
    ])
    return () => {
      setRoutes([])
    }
  }, [network, routeList])

  return useRoutes(routes!)
}

export default Router
