import { useEffect, useState } from 'react'
import { PAGES_BY_NETWORK } from 'util/constant'
import { COMMON_ROUTES, IRoute, ROUTE_LIST } from './routeList'
import { useSelector } from 'react-redux'
import { selectActiveNetwork } from 'selectors'
import { RouteObject, useRoutes } from 'react-router-dom'
import { intersection } from 'util/lodash'

export const Router = () => {
  const routeList = ROUTE_LIST
  const [routes, setRoutes] = useState<RouteObject[]>([])
  const network = useSelector(selectActiveNetwork())

  useEffect(() => {
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
