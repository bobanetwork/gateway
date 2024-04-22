import { setBridgeType } from 'actions/bridgeAction'
import { setNetwork } from 'actions/networkAction'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkType,
  selectBridgeType,
  selectNetwork,
  selectNetworkType,
} from 'selectors'
import {
  DEFAULT_NETWORK,
  NetworkType,
  networkLimitedAvailability,
} from 'util/network/network.util'
import { BridgeTabItem, BridgeTabs } from './style'

export enum BRIDGE_TYPE {
  CLASSIC = 'CLASSIC',
  FAST = 'FAST',
  LIGHT = 'LIGHT',
  THIRD_PARTY = 'THIRD_PARTY',
}

const BridgeTypeSelector = () => {
  const dispatch = useDispatch<any>()
  const bridgeType = useSelector(selectBridgeType())
  const networkType = useSelector(selectNetworkType())
  const network = useSelector(selectNetwork())
  const isOnLimitedNetwork = networkLimitedAvailability(networkType, network)
  const activeNetworkType = useSelector(selectActiveNetworkType())

  const isMainnet =
    useSelector(selectActiveNetworkType()) === NetworkType.MAINNET

  const switchToFullySupportedNetwork = () => {
    // change network back to fully supported network when leaving light bridge
    dispatch(
      setNetwork({
        network: DEFAULT_NETWORK.chain,
        name: DEFAULT_NETWORK.name,
        networkIcon: DEFAULT_NETWORK.icon,
        chainIds: DEFAULT_NETWORK.chainId,
        networkType,
      })
    )
  }

  useEffect(() => {
    if (bridgeType !== BRIDGE_TYPE.LIGHT && isOnLimitedNetwork) {
      switchToFullySupportedNetwork()
    }
  }, [bridgeType, isOnLimitedNetwork])

  const onTabClick = (payload: any) => {
    dispatch(setBridgeType(payload))
  }

  useEffect(() => {
    dispatch(setBridgeType(BRIDGE_TYPE.CLASSIC))
  }, [activeNetworkType])

  return (
    <BridgeTabs>
      <BridgeTabItem
        data-testid="classic-btn"
        active={bridgeType === BRIDGE_TYPE.CLASSIC}
        onClick={() => onTabClick(BRIDGE_TYPE.CLASSIC)}
      >
        Classic
      </BridgeTabItem>

      <BridgeTabItem
        data-testid="light-btn"
        active={bridgeType === BRIDGE_TYPE.LIGHT}
        onClick={() => onTabClick(BRIDGE_TYPE.LIGHT)}
      >
        Light
      </BridgeTabItem>

      {isMainnet ? (
        <BridgeTabItem
          data-testid="third-party-btn"
          active={bridgeType === BRIDGE_TYPE.THIRD_PARTY}
          onClick={() => onTabClick(BRIDGE_TYPE.THIRD_PARTY)}
        >
          Third Party
        </BridgeTabItem>
      ) : null}
    </BridgeTabs>
  )
}

export default BridgeTypeSelector
