import React, { useEffect } from 'react'
import { BridgeTabs, BridgeTabItem } from './style'
import { useDispatch, useSelector } from 'react-redux'
import { selectActiveNetworkType, selectBridgeType } from 'selectors'
import { setBridgeType } from 'actions/bridgeAction'
import { NetworkType } from '../../../util/network/network.util'

export enum BRIDGE_TYPE {
  CLASSIC = 'CLASSIC',
  FAST = 'FAST',
  LIGHT = 'LIGHT',
  THIRD_PARTY = 'THIRD_PARTY',
}

const BridgeTypeSelector = () => {
  const dispatch = useDispatch<any>()
  const bridgeType = useSelector(selectBridgeType())
  const activeNetworkType = useSelector(selectActiveNetworkType())

  // Only show teleportation on testnet for now
  const isTestnet =
    useSelector(selectActiveNetworkType()) === NetworkType.TESTNET

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
        data-testid="fast-btn"
        active={bridgeType === BRIDGE_TYPE.FAST}
        onClick={() => onTabClick(BRIDGE_TYPE.FAST)}
      >
        Fast
      </BridgeTabItem>

      {isTestnet ? (
        <BridgeTabItem
          data-testid="light-btn"
          active={bridgeType === BRIDGE_TYPE.LIGHT}
          onClick={() => onTabClick(BRIDGE_TYPE.LIGHT)}
        >
          Light
        </BridgeTabItem>
      ) : (
        <BridgeTabItem
          data-testid="third-party-btn"
          active={bridgeType === BRIDGE_TYPE.THIRD_PARTY}
          onClick={() => onTabClick(BRIDGE_TYPE.THIRD_PARTY)}
        >
          Third Party
        </BridgeTabItem>
      )}
    </BridgeTabs>
  )
}

export default BridgeTypeSelector
