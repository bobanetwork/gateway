import { getEarnInfo, withdrawLiquidity } from 'actions/earnAction'
import { closeModal, openError, openModal } from 'actions/uiAction'
import { Button } from 'components/global'
import Modal from 'components/modal/Modal'
import { WrapperActionsModal } from 'components/modal/styles'
import { NETWORK_ICONS } from 'containers/Bridging/chain/constant'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectActiveNetworkIcon,
  selectActiveNetworkName,
  selectLayer,
  selectWithdrawPayload,
} from 'selectors'
import { LAYER } from 'util/constant'
import {
  ConfirmLabel,
  ConfirmValue,
  Item,
  ConfirmValueWithIcon,
  WithdrawConfirmContainer,
} from './styles'
import { getCoinImage } from 'util/coinImage'

interface EarnWithdrawConfirmModalProps {
  open: boolean
}

const EarnWithdrawConfirmModal = ({ open }: EarnWithdrawConfirmModalProps) => {
  const dispatch = useDispatch<any>()
  const withdrawPayload = useSelector(selectWithdrawPayload())
  const activeNetworkName = useSelector(selectActiveNetworkName())
  const activeNetworkIcon = useSelector(selectActiveNetworkIcon())
  const layer = useSelector(selectLayer())
  const [loading, setLoading] = useState(false)

  const icons = NETWORK_ICONS[activeNetworkIcon]
  const L1Icon = icons['L1']
  const L2Icon = icons['L2']

  const handleClose = () => {
    dispatch(closeModal('EarnWithdrawConfirmModal'))
  }

  const handleConfirm = async () => {
    setLoading(true)
    const withdrawLiquidityTX = await dispatch(
      withdrawLiquidity(
        withdrawPayload.currency,
        withdrawPayload.amountToWithdrawWei,
        withdrawPayload.L1orL2Pool
      )
    )

    if (withdrawLiquidityTX) {
      dispatch(openModal('EarnWithdrawModalSuccess'))
      dispatch(getEarnInfo())
    } else {
      dispatch(openError(`Failed to withdraw ${withdrawPayload.symbol}`))
    }
    dispatch(closeModal('EarnWithdrawConfirmModal'))
    setLoading(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="md"
      title={`Withdraw Confirmation`}
      testId="earnwithdrawconfirmmodal-modal"
    >
      <WithdrawConfirmContainer>
        <Item>
          <ConfirmLabel>Pool</ConfirmLabel>
          <ConfirmValueWithIcon>
            {' '}
            {layer === LAYER.L1 ? (
              <L1Icon selected />
            ) : (
              <L2Icon selected />
            )}{' '}
            {activeNetworkName[layer.toLowerCase()]}
          </ConfirmValueWithIcon>
        </Item>
        <Item>
          <ConfirmLabel>Token</ConfirmLabel>
          <ConfirmValueWithIcon>
            <img src={getCoinImage(withdrawPayload.symbol)} alt="symbol logo" />{' '}
            {withdrawPayload.symbol}
          </ConfirmValueWithIcon>
        </Item>
        <Item>
          <ConfirmLabel>Amount to Withdraw</ConfirmLabel>
          <ConfirmValue>
            {withdrawPayload.amountToWithdraw} {withdrawPayload.symbol}
          </ConfirmValue>
        </Item>
        <Item>
          <ConfirmLabel>Time</ConfirmLabel>
          <ConfirmValue>1-5 minutes</ConfirmValue>
        </Item>
        <WrapperActionsModal style={{ width: '100%' }}>
          <Button
            data-testid="confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
            label="Confirm"
            style={{
              width: '100%',
            }}
          />
        </WrapperActionsModal>
      </WithdrawConfirmContainer>
    </Modal>
  )
}

export default EarnWithdrawConfirmModal
