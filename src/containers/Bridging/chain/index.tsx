import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkIcon,
  selectActiveNetworkName,
  selectBridgeType,
  selectDestChainIdTeleportation,
  selectLayer,
} from 'selectors'
import { openModal } from 'actions/uiAction'
import useSwitchChain from 'hooks/useSwitchChain'
import { DEFAULT_NETWORK, LAYER } from 'util/constant'
import { NETWORK_ICONS } from './constant'
import {
  ChainContainer,
  ChainIcon,
  ChainPicker,
  ChainPickerContainer,
  ChainPickerIcon,
  ChainPickerPlaceHolder,
  DownArrow,
  SectionLabel,
  SwitchChainIcon,
  SwitchIcon,
} from './styles'
import { BRIDGE_TYPE } from '../BridgeTypeSelector'
import { CHAIN_ID_LIST } from '../../../util/network/network.util'

type Props = {}

const Chains = (props: Props) => {
  const dispatch = useDispatch<any>()

  const { switchChain } = useSwitchChain()

  const networkNames = useSelector(selectActiveNetworkName())
  const activeNetworkIcon = useSelector(selectActiveNetworkIcon())
  const layer = useSelector(selectLayer())
  const icons = NETWORK_ICONS[activeNetworkIcon]
  const L1Icon = icons['L1']
  const L2Icon = icons['L2']

  const openNetworkPicker = (
    inputLayer: string,
    destNetworkSelection: boolean
  ) => {
    let sLayer = inputLayer
    if (layer && layer === LAYER.L2) {
      sLayer = inputLayer === 'l1' ? 'l2' : 'l1'
    }
    dispatch(
      openModal({
        modal: 'networkPicker',
        selectionLayer: sLayer,
        destNetworkSelection,
      })
    )
  }

  const L1ChainInfo = () => {
    return (
      <>
        <ChainIcon>
          <L1Icon selected />
        </ChainIcon>
        <ChainPickerPlaceHolder>
          {networkNames['l1'] || DEFAULT_NETWORK.NAME.L1}
        </ChainPickerPlaceHolder>
      </>
    )
  }

  const L2ChainInfo = () => {
    return (
      <>
        <ChainIcon>
          <L2Icon selected />
        </ChainIcon>
        <ChainPickerPlaceHolder>
          {networkNames['l2'] || DEFAULT_NETWORK.NAME.L2}
        </ChainPickerPlaceHolder>
      </>
    )
  }

  const TeleportationDestChainInfo = () => {
    const network = CHAIN_ID_LIST[teleportationDestChainId]
    if (!network) {
      console.warn('TeleportationDestChainInfo: Unknown network id')
      return
    }
    // use correct chain for icons
    const NetworkIcon =
      NETWORK_ICONS[network?.chain?.toLowerCase()][
        network?.layer?.toUpperCase()
      ]

    return (
      <>
        <ChainIcon>
          <NetworkIcon />
        </ChainIcon>
        <ChainPickerPlaceHolder>
          {network?.name || DEFAULT_NETWORK.NAME.L2}
        </ChainPickerPlaceHolder>
      </>
    )
  }

  const bridgeType = useSelector(selectBridgeType())
  const teleportationDestChainId = useSelector(selectDestChainIdTeleportation())

  let toChainLabel =
    !layer || layer === LAYER.L1 ? <L2ChainInfo /> : <L1ChainInfo />
  if (bridgeType === BRIDGE_TYPE.LIGHT && !!teleportationDestChainId) {
    // light bridge/teleportation allows for independent network selection
    toChainLabel = <TeleportationDestChainInfo />
  }
  return (
    <ChainContainer>
      <ChainPickerContainer>
        <SectionLabel>From</SectionLabel>
        <ChainPicker
          onClick={() => openNetworkPicker('l1', false)}
          data-testid="from-network-picker"
        >
          {!layer || layer === LAYER.L1 ? <L1ChainInfo /> : <L2ChainInfo />}
          <ChainPickerIcon>
            <DownArrow />
          </ChainPickerIcon>
        </ChainPicker>
      </ChainPickerContainer>
      <SwitchChainIcon
        onClick={() => switchChain()}
        data-testid="switchNetwork"
      >
        <SwitchIcon />
      </SwitchChainIcon>
      <ChainPickerContainer>
        <SectionLabel>To</SectionLabel>
        <ChainPicker
          data-testid="to-network-picker"
          onClick={() =>
            openNetworkPicker('l2', bridgeType === BRIDGE_TYPE.LIGHT)
          }
        >
          {toChainLabel}
          <ChainPickerIcon>
            <DownArrow />
          </ChainPickerIcon>
        </ChainPicker>
      </ChainPickerContainer>
    </ChainContainer>
  )
}

export default Chains
