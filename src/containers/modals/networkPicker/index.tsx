import { NetworkPickerModalContainer } from './styles'
import { closeModal } from 'actions/uiAction'
import Modal from 'components/modal/Modal'
import React, { ElementType, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ListLabel } from '../tokenPicker/styles'
import { NetworkList } from 'components/bridge/NetworkPickerList'
import { ModalInterface } from '../types'

const NetworkPickerModal: FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()

  const handleClose = () => {
    dispatch(closeModal('networkPicker'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Select Network"
      transparent={false}
    >
      <ListLabel> Network Names </ListLabel>
      <NetworkPickerModalContainer>
        <NetworkList close={handleClose} />
      </NetworkPickerModalContainer>
    </Modal>
  )
}

export default NetworkPickerModal
