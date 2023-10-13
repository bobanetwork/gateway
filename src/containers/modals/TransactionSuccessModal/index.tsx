import {
  SuccessContainer,
  SuccessCheck,
  MutedText,
  CircleOuter,
  CircleInner,
  TitleText,
  SuccessContent,
} from './index.styles'
import React, { FC } from 'react'
import { closeModal } from 'actions/uiAction'
import { Button, Heading, Typography } from 'components/global'
import Modal from 'components/modal/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  selectActiveNetworkName,
  selectBridgeType,
  selectLayer,
} from 'selectors'
import { LAYER } from 'util/constant'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { ModalInterface } from '../types'

const TransactionSuccessModal: FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()
  const layer = useSelector(selectLayer())
  const name = useSelector(selectActiveNetworkName())
  const bridgeType = useSelector(selectBridgeType())

  const estimateTime = () => {
    const estimates = {
      [BRIDGE_TYPE.CLASSIC]: {
        [LAYER.L1]: '13 ~ 14mins.',
        default: '7 days',
      },
      [BRIDGE_TYPE.FAST]: {
        [LAYER.L1]: '1 ~ 5min.',
        default: '15min ~ 3hrs.',
      },
      default: '~1min.',
    }

    return (
      estimates[bridgeType]?.[layer] ||
      estimates[bridgeType]?.default ||
      estimates.default
    )
  }

  const handleClose = () => {
    dispatch(closeModal('transactionSuccess'))
  }

  return (
    <Modal open={open} onClose={handleClose} title="" transparent={false}>
      <SuccessContainer>
        <CircleOuter>
          <CircleInner>
            <SuccessCheck />
          </CircleInner>
        </CircleOuter>
        <SuccessContent>
          <Heading variant="h1">Bridge Successful</Heading>
          <TitleText>
            Your funds will arrive in {estimateTime()} at your wallet on{' '}
            {layer === LAYER.L1 ? name['l2'] : name['l1']}.
          </TitleText>
          <MutedText>To monitor progress, go to History page.</MutedText>
        </SuccessContent>
        <Button
          onClick={() => {
            handleClose()
            navigate('/history')
          }}
          label="Go to history"
        />
      </SuccessContainer>
    </Modal>
  )
}

export default TransactionSuccessModal
