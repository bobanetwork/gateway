import React from 'react'
import { useDispatch } from 'react-redux'

import { closeModal, openModal } from 'actions/uiAction'
import Button from 'components/button/Button'
import Modal from 'components/modal/Modal'
import { MM_EXTENTION_URL } from 'util/constant'
import { setConnect } from 'actions/setupAction'
import { ButtonContainer } from './styles'
import { ModalInterface } from '../types'

const NoMetaMaskModal: React.FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()

  const handleClose = () => {
    dispatch(closeModal('noMetaMaskModal'))
    dispatch(setConnect(false))
  }

  const handleAddMetaMask = () => {
    window.open(MM_EXTENTION_URL, '_blank')
    dispatch(openModal('installMetaMaskModal'))
    handleClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Don't have MetaMask ?">
      <ButtonContainer>
        <Button
          type="primary"
          variant="contained"
          size="large"
          onClick={() => handleAddMetaMask()}
        >
          Add MetaMask to Chrome
        </Button>
      </ButtonContainer>
    </Modal>
  )
}

export default React.memo(NoMetaMaskModal)
