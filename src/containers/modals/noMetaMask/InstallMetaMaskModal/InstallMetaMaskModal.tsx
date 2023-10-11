import React from 'react'
import { useDispatch } from 'react-redux'

import { ModalTypography } from 'components/global/modalTypography'

import { closeModal } from 'actions/uiAction'
import { setConnect } from 'actions/setupAction'

import Button from 'components/button/Button'
import Modal from 'components/modal/Modal'

import { ModalInterface } from '../../types'
import { Container, ButtonContainer, Circle } from './styles'

const InstallMetaMaskModal: React.FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()

  const handleClose = () => {
    dispatch(closeModal('installMetaMaskModal'))
    dispatch(setConnect(false))
  }

  const handleRefresh = () => {
    handleClose()
    window.location.reload()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Don't have MetaMask ?">
      <Container>
        <div>
          <ModalTypography variant="body2">
            <Circle /> Install the MetaMask extension
          </ModalTypography>
          <ModalTypography variant="body3">
            We recommend pinning MetaMask to your taskbar for quicker access to
            your wallet.
          </ModalTypography>
        </div>
        <div>
          <ModalTypography variant="body2">
            <Circle /> Create New Wallet Or Import Wallet
          </ModalTypography>
          <ModalTypography variant="body3">
            Never share your secret phrase with anyone.
          </ModalTypography>
        </div>
        <div>
          <ModalTypography variant="body2">
            <Circle /> Refresh your browser
          </ModalTypography>
          <ModalTypography variant="body3">
            Once you are done with setting up wallet, click below refresh button
            to load up the extensions and access gateway.
          </ModalTypography>
        </div>
        <ButtonContainer>
          <Button
            type="primary"
            variant="contained"
            size="small"
            onClick={() => handleRefresh()}
          >
            Refresh
          </Button>
        </ButtonContainer>
      </Container>
    </Modal>
  )
}

export default React.memo(InstallMetaMaskModal)
