import React from 'react'

import { closeModal } from 'actions/uiAction'
import { useDispatch } from 'react-redux'

import Modal from 'components/modal/Modal'
import { NetworkList } from 'components/bridge/NetworkPickerList'

import { NetworkPickerModalContainer } from './styles'
import { ListLabel } from '../tokenPicker/styles'

import { NetworkPickerModalInterface } from './types'

const NetworkPickerModal: React.FC<NetworkPickerModalInterface> = ({
  open,
  destNetworkSelection,
}: NetworkPickerModalInterface) => {
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
        <NetworkList
          close={handleClose}
          isIndependentDestNetwork={destNetworkSelection}
        />
      </NetworkPickerModalContainer>
    </Modal>
  )
}

export default NetworkPickerModal
