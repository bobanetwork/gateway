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
  selectDestChainIdTeleportation,
  selectBridgeType,
} from 'selectors'

import { setActiveNetwork, setNetwork } from 'actions/networkAction'

import {
  NetworkPickerList,
  NetworkItem,
  NetworkIcon,
  NetworkLabel,
} from './styles'
import { setTeleportationDestChainId } from '../../../actions/bridgeAction'
import { BRIDGE_TYPE } from '../../../containers/Bridging/BridgeTypeSelector'
import {
  setBaseState,
  setConnectBOBA,
  setConnectETH,
} from '../../../actions/setupAction'
import { closeModal, openModal } from '../../../actions/uiAction'

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
  const bridgeType = useSelector(selectBridgeType())

  const isLightBridge = bridgeType === BRIDGE_TYPE.LIGHT
  // cannot use useIndependentDestNetwork here, since from-network should also contain OP/ARB
  const currTeleportationDestChainId = useSelector(
    selectDestChainIdTeleportation()
  )

  const l1Icon = L1_ICONS as Record<string, ElementType>
  const l2Icon = L2_ICONS as Record<string, ElementType>
  const networks = (NetworkLists as Record<string, any>)[networkType]
  const currentLayer = selectionLayer || (layer as string)?.toLowerCase()

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

      if (bridgeType === BRIDGE_TYPE.LIGHT) {
        // Workaround due to our tighly coupled network logic and wrongModal watcher, confirmed with Sahil that setNetwork + layerSet only approach for now
        let closeWrongNetworkModalIntervalCounter = 0
        const intervalID = setInterval(() => {
          dispatch(closeModal('switchNetworkModal'))
          dispatch(closeModal('wrongNetworkModal'))

          if (++closeWrongNetworkModalIntervalCounter === 30) {
            window.clearInterval(intervalID)
          }
        }, 150)

        const toLayer1 = layer?.toUpperCase() === 'L1'
        if (toLayer1) {
          dispatch(setConnectETH(true))
        } else {
          dispatch(setConnectBOBA(true))
        }
        dispatch(setActiveNetwork())
        dispatch(setBaseState(false))

        if (chainDetail.chainId === currTeleportationDestChainId) {
          dispatch(
            setTeleportationDestChainId(
              chainDetail.chainId[toLayer1 ? 'L2' : 'L1']
            )
          )
        }
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
        id={'networkItem'}
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
