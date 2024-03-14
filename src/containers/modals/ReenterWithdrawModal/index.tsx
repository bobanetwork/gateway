import React, { FC } from 'react'
import { CloseIcon } from 'components/ApplicationBanner/styles'
import { FeeSwitcherIcon } from 'components/layout/Header/feeSwitcher/styles'
import Tooltip from 'components/tooltip/Tooltip'
import {
  ConfirmActionButton,
  ConfirmLabel,
  ConfirmModalContainer,
} from './index.styles'
import { WithdrawState } from 'services/anchorage.service'

interface Props {
  state?: WithdrawState
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
      case WithdrawState.initialized:
        return 'Prove Withdrawal'
      case WithdrawState.proven:
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
