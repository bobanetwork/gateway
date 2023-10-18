import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from 'actions/uiAction'

import { Heading } from 'components/global'
import {
  ConfirmModalContainer,
  ConfirmLabel,
  ConfirmValue,
  ConfirmActionButton,
  Item,
  LayerNames,
} from './styles'
import Modal from 'components/modal/Modal'
import {
  selectActiveNetworkIcon,
  selectActiveNetworkName,
  selectAmountToBridge,
  selectBridgeType,
  selectLayer,
  selectLookupPrice,
  selectTokenToBridge,
} from 'selectors'
import { amountToUsd } from 'util/amountConvert'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import useBridge from 'hooks/useBridge'
import { NETWORK_ICONS } from 'containers/Bridging/chain/constant'
import { DEFAULT_NETWORK, LAYER } from 'util/constant'
import { ModalInterface } from '../types'

const BridgeConfirmModal: React.FC<ModalInterface> = ({ open }) => {
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

  const estimateTime = () => {
    const TIME_ESTIMATES = {
      [BRIDGE_TYPE.CLASSIC]: {
        [LAYER.L1]: '13 ~ 14mins.',
        default: '1 ~ 5min.',
      },
      [BRIDGE_TYPE.FAST]: {
        [LAYER.L1]: '1 ~ 5min.',
        default: '15min ~ 3hrs.',
      },
      default: '~1min.',
    }
    const bridgeEstimate = TIME_ESTIMATES[bridgeType] || TIME_ESTIMATES.default
    return typeof bridgeEstimate === 'string'
      ? bridgeEstimate
      : bridgeEstimate[layer] || bridgeEstimate.default
  }

  const handleClose = () => {
    dispatch(closeModal('bridgeConfirmModal'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
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
                <L1Icon selected />
                {networkNames['l1'] || DEFAULT_NETWORK.NAME.L1}
              </>
            ) : (
              <>
                <L2Icon selected />
                {networkNames['l2'] || DEFAULT_NETWORK.NAME.L2}
              </>
            )}
          </LayerNames>
        </Item>
        <Item>
          <ConfirmLabel>To</ConfirmLabel>
          <LayerNames>
            {layer === LAYER.L1 ? (
              <>
                <L2Icon selected />
                {networkNames['l2'] || DEFAULT_NETWORK.NAME.L2}
              </>
            ) : (
              <>
                <L1Icon selected />
                {networkNames['l1'] || DEFAULT_NETWORK.NAME.L1}
              </>
            )}
          </LayerNames>
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
          <ConfirmValue>0.000038 ETH</ConfirmValue>
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
