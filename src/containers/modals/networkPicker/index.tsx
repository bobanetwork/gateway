import React from 'react'

import { closeModal } from 'actions/uiAction'
import { useDispatch } from 'react-redux'

import Modal from 'components/modal/Modal'
import { NetworkList } from 'components/bridge/NetworkPickerList'

import { ModalInterface } from '../types'

import { NetworkPickerModalContainer } from './styles'
import { ListLabel } from '../tokenPicker/styles'

const NetworkPickerModal: React.FC<ModalInterface> = ({ open }) => {
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
      testId="network-picker-modal"
    >
      <ListLabel> Network Names </ListLabel>
      <NetworkPickerModalContainer>
        <NetworkList close={handleClose} />
      </NetworkPickerModalContainer>
    </Modal>
  )
}

export default NetworkPickerModal
