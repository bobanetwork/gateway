import { Heading } from 'components/global'
import {
  ConfirmModalContainer,
  ConfirmLabel,
  ConfirmValue,
  ConfirmActionButton,
  Item,
  LayerNames,
} from './index.styles'
import { closeModal } from 'actions/uiAction'
import Modal from 'components/modal/Modal'
import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkIcon,
  selectActiveNetworkName,
  selectAmountToBridge,
  selectBridgeType,
  selectDestChainIdTeleportation,
  selectL1FeeRateN,
  selectL2FeeRateN,
  selectLayer,
  selectLookupPrice,
  selectTokenToBridge,
} from 'selectors'
import { amountToUsd } from 'util/amountConvert'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import useBridge from 'hooks/useBridge'
import { NETWORK_ICONS } from 'containers/Bridging/chain/constant'
import { DEFAULT_NETWORK, LAYER } from 'util/constant'
import { CHAIN_ID_LIST } from '../../../util/network/network.util'

interface Props {
  open: boolean
}

const BridgeConfirmModal: FC<Props> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const l1FeeRateN = useSelector(selectL1FeeRateN)
  const l2FeeRateN = useSelector(selectL2FeeRateN)
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

  const estimateTime = () => {
    if (bridgeType === BRIDGE_TYPE.CLASSIC) {
      if (layer === LAYER.L1) {
        return '13 ~ 14mins.'
      } else {
        return '1 ~ 5min.'
      }
    } else if (bridgeType === BRIDGE_TYPE.FAST) {
      if (layer === LAYER.L1) {
        return '1 ~ 5min.'
      } else {
        return '15min ~ 3hrs.'
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
            {amountToUsd(amountToBridge, lookupPrice, token).toFixed(2)})
          </ConfirmValue>
        </Item>
        <Item>
          <ConfirmLabel>Gas Fee</ConfirmLabel>
          <ConfirmValue>
            {(layer === LAYER.L1 && bridgeType !== BRIDGE_TYPE.LIGHT
              ? l2FeeRateN
              : l1FeeRateN) || 0}
            %
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
