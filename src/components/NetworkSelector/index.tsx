import React, { useState } from 'react'
import {
  selectActiveNetwork,
  selectActiveNetworkType,
  selectActiveNetworkName,
  selectNetworkChainIds,
  selectModalState,
  selectLayer,
  selectChainIdChanged,
  selectDestChainIdTeleportation,
  selectBridgeType,
} from 'selectors'
import {
  INetwork,
  L1_ICONS,
  L2_ICONS,
  NetworkList,
  CHAIN_ID_LIST,
} from 'util/network/network.util'
import { setNetwork } from 'actions/networkAction'
import { useDispatch, useSelector } from 'react-redux'
import { setTeleportationDestChainId } from 'actions/bridgeAction'
import { ChainLabel } from 'components/bridge/ChainLabel'
import {
  NetworkContainer,
  Arrow,
  Dropdown,
  NetworkSelectorDropdown,
} from './styles'
import { getCoinImage } from 'util/coinImage'
import ArrowDown from 'assets/images/icons/arrowdown.svg'
// import { NetworkList } from 'components/bridge/NetworkPickerList'
import { Typography } from 'components/global/'
import networkReducer from 'reducers/networkReducer'
import { IDropdownItem } from 'components/global/dropdown'

const NetworkDropdownHeading = {
  label: 'Networks',
  header: true,
  value: 0,
}

export const NetworkSelector = () => {
  const dispatch = useDispatch<any>()
  const networkType = useSelector(selectActiveNetworkType())
  const layer = useSelector(selectLayer())
  const networkChainIds = useSelector(selectNetworkChainIds())

  const currentNetworkIsL1 = layer === 'L1'
  const currentNetworkChainId = Number(networkChainIds[layer])
  const currentNetwork = {
    label: CHAIN_ID_LIST[currentNetworkChainId].siteName,
    value: String(currentNetworkChainId),
    imgSrc: CHAIN_ID_LIST[currentNetworkChainId].imgSrc,
    imgType: 'img',
  }
  const currTeleportationDestChainId = useSelector(
    selectDestChainIdTeleportation()
  )
  const onSelect = (chainId: string | undefined) => {
    if (!chainId) {
      return
    }
    const chainDetail = CHAIN_ID_LIST[Number(chainId)]
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

  const getNetworkItems = () => {
    const networksList =
      networkType === 'Testnet' ? NetworkList.Testnet : NetworkList.Mainnet
    let networkOptions = networksList.map((network) => {
      const networkName = currentNetworkIsL1 ? network.name.l1 : network.name.l2
      const chainId = currentNetworkIsL1
        ? network.chainId.L1
        : network.chainId.L2
      return {
        label: networkName,
        value: chainId,
        imgSrc: CHAIN_ID_LIST[Number(chainId)].imgSrc,
        imgType: 'img',
        headerName: 'Networks',
      }
    })

    networkOptions = networkOptions.filter((option, index) => {
      const firstOccurence = networkOptions.findIndex(
        (existingOption) => existingOption.value === option.value
      )
      return firstOccurence === index
    })

    return [NetworkDropdownHeading, ...networkOptions]
  }

  return (
    <NetworkSelectorDropdown
      items={getNetworkItems() as IDropdownItem[]}
      defaultItem={currentNetwork}
      onItemSelected={(item) => onSelect(item.value)}
      setSelectedOnClick={false}
      error={false}
      headers={['Networks']}
    />
  )
}
