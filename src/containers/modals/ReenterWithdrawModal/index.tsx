import {
  ConfirmLabel,
  ConfirmModalContainer,
  ConfirmActionButton,
} from './index.styles'
import { useDispatch } from 'react-redux'
import React, { FC } from 'react'
import { FeeSwitcherIcon } from '../../../components/layout/Header/feeSwitcher/styles'
import { CloseIcon } from '../../../components/ApplicationBanner/styles'
import Tooltip from '../../../components/tooltip/Tooltip'

interface Props {
  state?: 1 | 2
  onReenterWithdrawal: () => any
  handleClose: () => any
}

const ReenterWithdrawModal: FC<Props> = ({
  state,
  onReenterWithdrawal,
  handleClose,
}) => {
  const getState = () => {
    switch (state) {
      case 1:
        return 'Prove Withdrawal'
      case 2:
        return 'Claim your Withdrawal'
    }
  }

  return (
    <ConfirmModalContainer>
      <Tooltip
        title={`We've identified, that one of your withdrawal transactions is still ongoing. Tap on 'Continue' to complete the withdrawal process.`}
      >
        <FeeSwitcherIcon fontSize="small" />
      </Tooltip>{' '}
      <ConfirmLabel>Continue withdrawal transaction: {getState()}</ConfirmLabel>
      <ConfirmActionButton onClick={onReenterWithdrawal}>
        Confirm
      </ConfirmActionButton>
      <CloseIcon onClick={handleClose} />
    </ConfirmModalContainer>
  )
}

export default ReenterWithdrawModal
