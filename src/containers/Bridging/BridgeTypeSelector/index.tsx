import React from 'react'
import { BridgeTabs, BridgeTabItem } from './style'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkType,
  selectBridgeType,
  selectNetwork,
  selectNetworkType,
} from 'selectors'
import { setBridgeType } from 'actions/bridgeAction'
import {
  NETWORK,
  NETWORK_TYPE,
  networkLimitedAvailability,
  NetworkList,
} from '../../../util/network/network.util'
import { setNetwork } from '../../../actions/networkAction'

export enum BRIDGE_TYPE {
  CLASSIC = 'CLASSIC',
  FAST = 'FAST',
  LIGHT = 'LIGHT',
}
const BridgeTypeSelector = () => {
  const dispatch = useDispatch<any>()
  const bridgeType = useSelector(selectBridgeType())
  const networkType = useSelector(selectNetworkType())
  const network = useSelector(selectNetwork())
  const isOnLimitedNetwork = networkLimitedAvailability(networkType, network)

  // Only show teleportation on testnet for now
  const isTestnet =
    useSelector(selectActiveNetworkType()) === NETWORK_TYPE.TESTNET

  const onTabClick = (payload: any) => {
    if (payload !== BRIDGE_TYPE.LIGHT && isOnLimitedNetwork) {
      // change network back to fully supported network when leaving light bridge
      const defaultChainDetail = NetworkList[networkType].find(
        (n) => n.chain === NETWORK.ETHEREUM
      )

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
    dispatch(setBridgeType(payload))
  }

  return (
    <BridgeTabs>
      <BridgeTabItem
        active={bridgeType === BRIDGE_TYPE.CLASSIC}
        onClick={() => onTabClick(BRIDGE_TYPE.CLASSIC)}
      >
        Classic
      </BridgeTabItem>
      <BridgeTabItem
        active={bridgeType === BRIDGE_TYPE.FAST}
        onClick={() => onTabClick(BRIDGE_TYPE.FAST)}
      >
        Fast
      </BridgeTabItem>

      {isTestnet ? (
        <BridgeTabItem
          active={bridgeType === BRIDGE_TYPE.LIGHT}
          onClick={() => onTabClick(BRIDGE_TYPE.LIGHT)}
        >
          Light
        </BridgeTabItem>
      ) : null}
    </BridgeTabs>
  )
}

export default BridgeTypeSelector
