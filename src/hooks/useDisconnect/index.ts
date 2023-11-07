import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { disconnectSetup } from 'actions/setupAction'
import {
  setActiveNetwork,
  setActiveNetworkType,
  setNetwork,
} from 'actions/networkAction'
import { selectChainIdChanged } from 'selectors'
import networkService from 'services/networkService'
import { CHAIN_ID_LIST, NetworkList } from 'util/network/network.util'
import { NetworkType } from './types'

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
