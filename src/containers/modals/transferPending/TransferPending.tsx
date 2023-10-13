import React from 'react'

import { Box, CircularProgress } from '@mui/material'

import { closeModal } from 'actions/uiAction'
import Modal from 'components/modal/Modal'
import { ModalTypography } from 'components/global/modalTypography'

import { useDispatch } from 'react-redux'
import { ModalInterface } from '../types'
import { Container, LoadingCircle } from './styles'

const TransferPendingModal: React.FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()

  const handleClose = () => {
    dispatch(closeModal('transferPending'))
  }

  return (
    <Modal open={open} onClose={handleClose} title="Transaction Pending">
      <Container>
        <LoadingCircle />
        <ModalTypography variant="body2">
          Waiting for confirmation from MetaMask
        </ModalTypography>
      </Container>
    </Modal>
  )
}

export default React.memo(TransferPendingModal)
