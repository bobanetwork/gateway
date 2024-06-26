import { closeModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import Modal from 'components/modal/Modal'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { NETWORK_ICONS } from 'containers/Bridging/chain/constant'
import useBridge from 'hooks/useBridge'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkIcon,
  selectActiveNetworkName,
  selectAmountToBridge,
  selectBridgeType,
  selectDestChainIdTeleportation,
  selectLayer,
  selectLookupPrice,
  selectTokenToBridge,
} from 'selectors'
import { amountToUsd } from 'util/amountConvert'
import { DEFAULT_NETWORK, LAYER } from 'util/constant'
import { CHAIN_ID_LIST } from '../../../util/network/network.util'
import {
  ConfirmActionButton,
  ConfirmLabel,
  ConfirmModalContainer,
  ConfirmValue,
  Item,
  LayerNames,
} from './index.styles'
import { useNetworkInfo } from 'hooks/useNetworkInfo'

interface Props {
  open: boolean
}

const BridgeConfirmModal: FC<Props> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const bridgeType = useSelector(selectBridgeType())
  const token = useSelector(selectTokenToBridge())
  const amountToBridge = useSelector(selectAmountToBridge())
  const lookupPrice = useSelector(selectLookupPrice)
  const networkNames = useSelector(selectActiveNetworkName())
  const activeNetworkIcon = useSelector(selectActiveNetworkIcon())
  const layer = useSelector(selectLayer())
  const icons = NETWORK_ICONS[activeNetworkIcon]
  const L1Icon = icons['L1']
  const L2Icon = icons['L2']

  const { triggerSubmit } = useBridge()
  const { isAnchorageEnabled } = useNetworkInfo()

  const estimateTime = () => {
    if (bridgeType === BRIDGE_TYPE.CLASSIC) {
      if (layer === LAYER.L1) {
        return '13 ~ 14mins.'
      } else {
        return '7 days'
      }
    } else {
      // Teleportation, instant
      return '~1min.'
    }
  }

  const handleClose = () => {
    dispatch(closeModal('bridgeConfirmModal'))
  }

  let destNetwork =
    layer === LAYER.L1 ? (
      <>
        <L2Icon selected /> {networkNames['l2'] || DEFAULT_NETWORK.NAME.L2}
      </>
    ) : (
      <>
        <L1Icon selected /> {networkNames['l1'] || DEFAULT_NETWORK.NAME.L1}{' '}
      </>
    )

  const teleportationDestChainId = useSelector(selectDestChainIdTeleportation())

  if (bridgeType === BRIDGE_TYPE.LIGHT && !!teleportationDestChainId) {
    // light bridge/teleportation allows for independent network selection
    const targetNetwork = CHAIN_ID_LIST[teleportationDestChainId]
    const NetworkIcon =
      NETWORK_ICONS[targetNetwork?.chain?.toLowerCase()][
        targetNetwork?.layer?.toUpperCase()
      ]

    destNetwork = (
      <>
        <NetworkIcon selected /> {targetNetwork.name || DEFAULT_NETWORK.NAME.L2}
      </>
    )
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      minHeight="180px"
      title="Bridge Confirmation"
      transparent={false}
    >
      <ConfirmModalContainer>
        <Item>
          <ConfirmLabel>Bridge Type</ConfirmLabel>
          <ConfirmValue>{bridgeType.toLowerCase()} Bridge</ConfirmValue>
        </Item>
        <Item>
          <ConfirmLabel>From</ConfirmLabel>
          <LayerNames>
            {layer === LAYER.L1 ? (
              <>
                <L1Icon selected />{' '}
                {networkNames['l1'] || DEFAULT_NETWORK.NAME.L1}
              </>
            ) : (
              <>
                <L2Icon selected />{' '}
                {networkNames['l2'] || DEFAULT_NETWORK.NAME.L2}
              </>
            )}
          </LayerNames>
        </Item>
        <Item>
          <ConfirmLabel>To</ConfirmLabel>
          <LayerNames>{destNetwork}</LayerNames>
        </Item>
        <Item>
          <ConfirmLabel>Amount to bridge</ConfirmLabel>
          <ConfirmValue>
            {amountToBridge} {token.symbol} ($
            {amountToUsd(amountToBridge, lookupPrice, token).toFixed(4)})
          </ConfirmValue>
        </Item>
        <Item>
          <ConfirmLabel>Time</ConfirmLabel>
          <ConfirmValue>{estimateTime()}</ConfirmValue>
        </Item>
        <ConfirmActionButton
          onClick={() => {
            triggerSubmit()
            handleClose()
          }}
          label={<Heading variant="h3">Confirm</Heading>}
        />
      </ConfirmModalContainer>
    </Modal>
  )
}

export default BridgeConfirmModal
