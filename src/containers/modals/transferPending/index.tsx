import React from 'react'
import { useDispatch } from 'react-redux'
import { closeModal } from 'actions/uiAction'
import Modal from 'components/modal/Modal'
import { TransferPendingContainer } from './styles'
import { ModalInterface } from '../types'
import Loader from 'assets/images/loader.svg'
import { Typography } from 'components/global/typography'

const TransferPendingModal: React.FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()

  const handleClose = () => {
    dispatch(closeModal('transferPending'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      minHeight="300px"
      title="Transaction Pending"
      testId="transferpending-modal"
      newStyle={true}
    >
      <TransferPendingContainer>
        <img src={Loader} alt="Loader" />
        <Typography variant="body2">
          Waiting for confirmation from MetaMask
        </Typography>
      </TransferPendingContainer>
    </Modal>
  )
}

export default React.memo(TransferPendingModal)
