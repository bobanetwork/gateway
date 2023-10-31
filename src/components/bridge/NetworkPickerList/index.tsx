import React, { ElementType, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  INetwork,
  L1_ICONS,
  L2_ICONS,
  NetworkList as NetworkLists,
} from 'util/network/network.util'

import {
  selectActiveNetwork,
  selectActiveNetworkType,
  selectModalState,
  selectLayer,
  selectIsTeleportationOfAssetSupported,
  selectDestChainIdTeleportation,
  selectBridgeType,
} from 'selectors'

import { setNetwork } from 'actions/networkAction'

import {
  NetworkPickerList,
  NetworkItem,
  NetworkIcon,
  NetworkLabel,
} from './styles'
import { setTeleportationDestChainId } from '../../../actions/bridgeAction'
import { BRIDGE_TYPE } from '../../../containers/Bridging/BridgeTypeSelector'

export interface NetworkListProps {
  close?: () => void
  isIndependentDestNetwork?: boolean
}

export const NetworkList: FC<NetworkListProps> = ({
  close = () => {},
  isIndependentDestNetwork,
}) => {
  const dispatch = useDispatch<any>()

  const networkType = useSelector(selectActiveNetworkType())
  const activeNetwork = useSelector(selectActiveNetwork())
  const selectionLayer = useSelector(selectModalState('selectionLayer'))
  const layer = useSelector<any>(selectLayer())

  // cannot use useIndependentDestNetwork here, since from-network should also contain OP/ARB
  const isLightBridge = useSelector(selectBridgeType()) === BRIDGE_TYPE.LIGHT
  const currTeleportationDestChainId = useSelector(
    selectDestChainIdTeleportation()
  )

  const l1Icon = L1_ICONS as Record<string, ElementType>
  const l2Icon = L2_ICONS as Record<string, ElementType>
  const networks = (NetworkLists as Record<string, any>)[networkType]
  const currentLayer = selectionLayer || (layer as string).toLowerCase()

  const onChainChange = (chainDetail: INetwork, layer: string) => {
    if (isIndependentDestNetwork) {
      dispatch(
        setTeleportationDestChainId(chainDetail.chainId[layer?.toUpperCase()])
      )
    } else {
      dispatch(
        setNetwork({
          network: chainDetail.chain,
          name: chainDetail.name,
          networkIcon: chainDetail.icon,
          chainIds: chainDetail.chainId,
          networkType,
        })
      )
      if (chainDetail.chainId === currTeleportationDestChainId) {
        dispatch(
          setTeleportationDestChainId(
            chainDetail.chainId[layer?.toUpperCase() === 'L1' ? 'L2' : 'L1']
          )
        )
      }
    }
    close()
  }

  const getNetworkItem = (chainDetail: INetwork, layer: string) => {
    if (
      // do not show source network
      (isIndependentDestNetwork &&
        activeNetwork === chainDetail.chain &&
        currentLayer !== layer) ||
      // limited network
      (!isLightBridge && chainDetail.limitedAvailability) ||
      // also hide duplicate L1's (e.g. ETH)
      (isLightBridge && chainDetail.limitedAvailability && layer === 'l1')
    ) {
      return
    }

    const CurrentIcon =
      layer === 'l1' ? l1Icon[chainDetail.icon] : l2Icon[chainDetail.icon]

    const selected =
      isIndependentDestNetwork && currTeleportationDestChainId
        ? currTeleportationDestChainId ===
          chainDetail.chainId[layer?.toUpperCase()]
        : chainDetail.chain === activeNetwork && currentLayer === layer

    return (
      <NetworkItem
        selected={selected}
        key={`${chainDetail.label}_${layer}_${chainDetail.key}`}
        onClick={() => onChainChange(chainDetail, layer)}
      >
        <NetworkIcon>
          <CurrentIcon selected />
        </NetworkIcon>
        <NetworkLabel>{chainDetail.name[layer]}</NetworkLabel>
      </NetworkItem>
    )
  }

  return (
    <NetworkPickerList>
      {networks.map((chainDetail: INetwork) => {
        return (
          <React.Fragment key={chainDetail.key + '_' + chainDetail.chainId}>
            {getNetworkItem(chainDetail, currentLayer)}
            {isLightBridge
              ? getNetworkItem(chainDetail, currentLayer === 'l1' ? 'l2' : 'l1')
              : null}
          </React.Fragment>
        )
      })}
    </NetworkPickerList>
  )
}
