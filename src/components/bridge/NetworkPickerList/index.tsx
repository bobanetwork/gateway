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
} from 'selectors'

import { setNetwork } from 'actions/networkAction'

import {
  NetworkPickerList,
  NetworkItem,
  NetworkIcon,
  NetworkLabel,
} from './styles'
import { setTeleportationDestChainId } from '../../../actions/bridgeAction'

export interface NetworkListProps {
  close?: () => void
  useIndependentDestNetwork?: boolean
}

export const NetworkList: FC<NetworkListProps> = ({
  close = () => {},
  useIndependentDestNetwork,
}) => {
  const dispatch = useDispatch<any>()

  const networkType = useSelector(selectActiveNetworkType())
  const activeNetwork = useSelector(selectActiveNetwork())
  const selectionLayer = useSelector(selectModalState('selectionLayer'))
  const layer = useSelector<any>(selectLayer())
  const currTeleportationDestChainId = useSelector(
    selectDestChainIdTeleportation()
  )

  const l1Icon = L1_ICONS as Record<string, ElementType>
  const l2Icon = L2_ICONS as Record<string, ElementType>

  const networks = (NetworkLists as Record<string, any>)[networkType]
  const currentLayer = selectionLayer || (layer as string).toLowerCase()
  const onChainChange = (chainDetail: INetwork, layer: string) => {
    if (useIndependentDestNetwork) {
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

  const getNetworkItem = (chainDetail: INetwork, layer) => {
    if (
      useIndependentDestNetwork &&
      activeNetwork === chainDetail.chain &&
      currentLayer !== layer
    ) {
      // do not show source network
      return
    }

    const CurrentIcon =
      layer === 'l1' ? l1Icon[chainDetail.icon] : l2Icon[chainDetail.icon]

    return (
      <NetworkItem
        selected={chainDetail.chain === activeNetwork && currentLayer === layer}
        key={`${chainDetail.label}_${layer}`}
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
          <>
            {getNetworkItem(chainDetail, currentLayer)}
            {useIndependentDestNetwork
              ? getNetworkItem(chainDetail, currentLayer === 'l1' ? 'l2' : 'l1')
              : null}
          </>
        )
      })}
    </NetworkPickerList>
  )
}
