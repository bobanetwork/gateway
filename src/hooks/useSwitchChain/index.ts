/**
 * useSwitchChain:
 * - this hooks is only responsible to switch between the chains.
 */

import { setConnectBOBA, setConnectETH } from 'actions/setupAction'
import { openModal } from 'actions/uiAction'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectActiveNetwork,
  selectActiveNetworkType,
  selectBridgeType,
  selectDestChainIdTeleportation,
  selectLayer,
} from 'selectors'
import { Layer, LAYER } from 'util/constant'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { setNetwork } from 'actions/networkAction'
import { CHAIN_ID_LIST, INetwork, NetworkList } from 'util/network/network.util'
import { setTeleportationDestChainId } from 'actions/bridgeAction'

const useSwitchChain = () => {
  const dispatch = useDispatch<any>()
  const accountEnabled = useSelector(selectAccountEnabled())

  const activeNetworkType = useSelector(selectActiveNetworkType())
  const activeNetwork = useSelector(selectActiveNetwork())
  const layer = useSelector(selectLayer())
  const bridgeType = useSelector(selectBridgeType())
  const teleportationDestChainId = useSelector(selectDestChainIdTeleportation())

  const switchChain = () => {
    if (accountEnabled) {
      let isOnSameChain = true
      let currChainId
      const currChainIds = (NetworkList[activeNetworkType] as INetwork[])?.find(
        (n) => n.chain === activeNetwork
      )?.chainId

      if (teleportationDestChainId && currChainIds) {
        isOnSameChain =
          currChainIds.L1 === teleportationDestChainId ||
          currChainIds.L2 === teleportationDestChainId
        currChainId = currChainIds[layer]
      }

      if (
        bridgeType === BRIDGE_TYPE.LIGHT &&
        teleportationDestChainId &&
        !isOnSameChain
      ) {
        // Light bridge has independent network selection
        const prevDestChainNetwork = CHAIN_ID_LIST[teleportationDestChainId]
        if (!prevDestChainNetwork) {
          console.warn(
            'Unknown destination chain id: ',
            teleportationDestChainId
          )
          return
        }

        dispatch(
          setNetwork({
            network: prevDestChainNetwork.chain,
            name: prevDestChainNetwork.name,
            networkIcon: prevDestChainNetwork.icon,
            chainIds: teleportationDestChainId,
            networkType: prevDestChainNetwork.networkType,
            limitedAvailability: prevDestChainNetwork.limitedAvailability,
          })
        )
        dispatch(setTeleportationDestChainId(currChainId))
      } else {
        if (!layer || layer === LAYER.L2) {
          dispatch(setConnectETH(true))
        } else {
          dispatch(setConnectBOBA(true))
        }
      }
    } else {
      dispatch(openModal('walletSelectorModal'))
    }
  }

  return { switchChain }
}

export default useSwitchChain
