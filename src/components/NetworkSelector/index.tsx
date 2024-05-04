import React, { useEffect, useState } from 'react'
import {
  selectActiveNetworkType,
  selectNetworkChainIds,
  selectLayer,
  selectBridgeType,
} from 'selectors'
import { NetworkList, CHAIN_ID_LIST, Network } from 'util/network/network.util'
import { setNetwork } from 'actions/networkAction'
import { useDispatch, useSelector } from 'react-redux'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { NetworkSelectorDropdown } from './styles'
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
  const bridgeType = useSelector(selectBridgeType())

  const [currentOption, setCurrentOption] = useState<any>({
    label: CHAIN_ID_LIST[1].siteName,
    value: String(1),
    imgSrc: CHAIN_ID_LIST[1].imgSrc,
    imgType: 'img',
  })

  const currentNetworkIsL1 = layer === 'L1'

  const lightBridgeInUse = BRIDGE_TYPE.LIGHT === bridgeType

  const onSelect = (chainId: string | number | undefined) => {
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
  }

  useEffect(() => {
    if (networkChainIds) {
      const chainId =
        typeof networkChainIds === 'object'
          ? Number(networkChainIds[layer])
          : networkChainIds
      setCurrentOption({
        label: CHAIN_ID_LIST[chainId].siteName,
        value: String(chainId),
        imgSrc: CHAIN_ID_LIST[chainId].imgSrc,
        imgType: 'img',
      })
    }
  }, [networkChainIds, layer])

  const getNetworkItems = () => {
    let networksList =
      networkType === 'Testnet'
        ? [...NetworkList.Testnet]
        : [...NetworkList.Mainnet]

    networksList = networksList.filter((network) => {
      if (network.limitedAvailability) {
        return lightBridgeInUse
      }
      return true
    })

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
      defaultItem={currentOption}
      onItemSelected={(item) => onSelect(item.value)}
      setSelectedOnClick={false}
      error={false}
      headers={['Networks']}
      testId={'network-selector'}
    />
  )
}
