import React from 'react'

import { closeModal } from 'actions/uiAction'
import { useDispatch } from 'react-redux'

import { Button, Heading } from 'components/global'
import Modal from 'components/modal/Modal'

import {
  CircleInner,
  CircleOuter,
  SuccessCheck,
  SuccessContainer,
  SuccessContent,
  TitleText,
} from './styles'

interface EarnWithdrawModalSuccessModalProps {
  open: boolean
}

const EarnWithdrawModalSuccessModal = ({
  open,
}: EarnWithdrawModalSuccessModalProps) => {
  const dispatch = useDispatch<any>()

  const handleClose = () => {
    dispatch(closeModal('EarnWithdrawModalSuccess'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      transparent={false}
      testId="earnwithdrawmodalsuccess-modal"
    >
      <SuccessContainer>
        <CircleOuter>
          <CircleInner>
            <SuccessCheck />
          </CircleInner>
        </CircleOuter>
        <SuccessContent>
          <Heading variant="h2">Withdraw Successful</Heading>
          <TitleText>
            Your funds will arrive in 1-5 minutes in your wallet.
          </TitleText>
        </SuccessContent>
        <Button
          data-testid="close-btn"
          onClick={() => {
            handleClose()
          }}
          label="Close"
        />
      </SuccessContainer>
    </Modal>
  )
}

export default EarnWithdrawModalSuccessModal
