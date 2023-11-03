import { disconnectSetup } from 'actions/setupAction'
import { useDispatch, useSelector } from 'react-redux'

import {
  setActiveNetwork,
  setActiveNetworkType,
  setNetwork,
} from 'actions/networkAction'
import { useEffect } from 'react'
import { selectChainIdChanged } from 'selectors'
import networkService from 'services/networkService'
import { CHAIN_ID_LIST, NetworkList } from 'util/network/network.util'

interface NetworkType {
  networkType: string
  network: string
  networkIcon: string
  name: string
  chain: string
  icon: string
}

const useDisconnect = () => {
  const dispatch = useDispatch<any>()
  const chainIdChanged = useSelector(selectChainIdChanged())

  const disconnect = async () => {
    await networkService.walletService.disconnect()
    dispatch(disconnectSetup())
  }

  useEffect(() => {
    const switchChain = () => {
      const { networkType, chain } = CHAIN_ID_LIST[Number(chainIdChanged)]
      const foundNetwork = NetworkList[networkType].find(
        (network: NetworkType) => network.chain === chain
      ) as NetworkType

      if (foundNetwork) {
        const { chain: network, icon: networkIcon, name } = foundNetwork

        dispatch(setActiveNetworkType({ networkType }))
        dispatch(
          setNetwork({
            networkType,
            network,
            networkIcon,
            name,
          })
        )
        dispatch(setActiveNetwork())
      }
    }

    const disconnectAndSwitch = async () => {
      // on changing network from metamask disconnect wallet,
      // restart connect flow again with the new network by updating state.
      if (chainIdChanged) {
        await disconnect()
        switchChain()
      }
    }

    disconnectAndSwitch()
  }, [chainIdChanged, disconnect])

  return { disconnect }
}

export default useDisconnect
