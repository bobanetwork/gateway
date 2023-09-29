import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  selectActiveNetworkName,
  selectActiveNetworkIcon,
  selectLayer,
  selectDestChainIdTeleportation,
  selectBridgeType,
} from 'selectors'
import { DEFAULT_NETWORK, LAYER } from 'util/constant'
import { CHAIN_ID_LIST, L1_ICONS, L2_ICONS } from 'util/network/network.util'
import { ChainLabelContainer } from './styles'
import { IconType, ChainLabelInterface, DirectionType } from './types'
import { BRIDGE_TYPE } from '../../../containers/Bridging/BridgeTypeSelector'

export const ChainLabel = ({ direction }: ChainLabelInterface) => {
  const [toL2, setToL2] = useState(true)

  const layer = useSelector(selectLayer())
  const networkName = useSelector(selectActiveNetworkName())
  const icon: keyof IconType = useSelector(selectActiveNetworkIcon())

  const bridgeType = useSelector(selectBridgeType())
  const teleportationDestChainId = useSelector(selectDestChainIdTeleportation())

  const isL1 = layer === LAYER.L1

  useEffect(() => {
    setToL2(isL1)
  }, [isL1])

  const L1Icon = L1_ICONS[icon]
  const L2Icon = L2_ICONS[icon]

  const L1ChainLabel = () => {
    return (
      <ChainLabelContainer variant="body2">
        <L1Icon selected />
        {networkName['l1'] || DEFAULT_NETWORK.NAME.L1}
      </ChainLabelContainer>
    )
  }

  const L2ChainLabel = () => {
    return (
      <ChainLabelContainer variant="body2">
        <L2Icon selected />
        {networkName['l2'] || DEFAULT_NETWORK.NAME.L2}
      </ChainLabelContainer>
    )
  }

  const TeleportationDestChainLabel = () => {
    const network = CHAIN_ID_LIST[teleportationDestChainId]
    return (
      <ChainLabelContainer variant="body2">
        {network?.layer === LAYER.L1 ? (
          <L1Icon selected />
        ) : (
          <L2Icon selected />
        )}
        {network?.name || DEFAULT_NETWORK.NAME.L2}
      </ChainLabelContainer>
    )
  }

  let toChainLabel = toL2 ? <L2ChainLabel /> : <L1ChainLabel />
  if (bridgeType === BRIDGE_TYPE.TELEPORTATION && !!teleportationDestChainId) {
    toChainLabel = <TeleportationDestChainLabel />
  }

  const config: DirectionType = {
    from: toL2 ? <L1ChainLabel /> : <L2ChainLabel />,
    to: toChainLabel,
  }

  const selectedDirection = config[direction as keyof DirectionType]

  return direction ? selectedDirection : config.from
}
