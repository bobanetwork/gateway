import { useEffect, useState } from 'react';
import {PAGES_BY_NETWORK, ROUTES_PATH} from 'util/constant'
import { COMMON_ROUTES, ROUTE_LIST } from './routeList'
import {useDispatch, useSelector} from 'react-redux';
import {selectActiveNetwork, selectNetwork, selectNetworkType} from 'selectors';
import { useRoutes } from 'react-router-dom';
import { intersection } from 'util/lodash';
import {NETWORK, networkLimitedAvailability, NetworkList} from "../../util/network/network.util";
import {setNetwork} from "../../actions/networkAction";

export const Router = () => {
  const routeList = ROUTE_LIST;
  const [ routes, setRoutes ] = useState([]);
  const dispatch = useDispatch();
  const network = useSelector(selectActiveNetwork());
  const networkType = useSelector(selectNetworkType())

  useEffect(() => {
    const isOnLimitedNetwork = networkLimitedAvailability(networkType, network)

    const childRoutes = routeList[ 0 ].children;
    const fRoutes = childRoutes.filter((m) => intersection([ m.key ], PAGES_BY_NETWORK[ network.toLowerCase() ]).length);
    const {path, ...indexRoute} = fRoutes[ 0 ];
    const _routes = [
      {
        ...indexRoute,
        index:true
      },
      ...fRoutes,
      ...COMMON_ROUTES
    ].filter((r) => !r.disable)

    console.log("SWITCHING PAGE: ", routeList[0], _routes)
    if (isOnLimitedNetwork && (routeList[0].path !== '/' && routeList[0].path !== ROUTES_PATH.BRIDGE)) {
      const defaultChainDetail =
          NetworkList[networkType].find(n => n.chain === NETWORK.ETHEREUM)

      // switch network when switching page for limited networks
      dispatch(
          setNetwork({
            network: defaultChainDetail.chain,
            name: defaultChainDetail.name,
            networkIcon: defaultChainDetail.icon,
            chainIds: defaultChainDetail.chainId,
            networkType,
          })
      )
    }

    setRoutes([
      {
        ...routeList[ 0 ],
        children: _routes
      }
    ]);
    return () => {
      setRoutes(null)
    };
  }, [ network, routeList ]);

  return useRoutes(routes);
}

export default Router;
