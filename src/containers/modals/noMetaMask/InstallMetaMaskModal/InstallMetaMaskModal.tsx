import React from 'react'
import { useDispatch } from 'react-redux'

import { ModalTypography } from 'components/global/modalTypography'

import { closeModal } from 'actions/uiAction'
import { setConnect } from 'actions/setupAction'

import { Button } from 'components/global/button'

import Modal from 'components/modal/Modal'

import { ModalInterface } from '../../types'
import { Container, ButtonContainer, Circle } from './styles'

import { ItemType } from './types'
import { InstallMetamaskSteps } from './consts'

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

  const Item: React.FC<ItemType> = ({ title, body, index }) => {
    return (
      <div key={index}>
        <ModalTypography variant="body2">
          <Circle /> {title}
        </ModalTypography>
        <ModalTypography variant="body3">{body}</ModalTypography>
      </div>
    )
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Don't have MetaMask ?"
      testId="installMetamask-modal"
    >
      <Container>
        {InstallMetamaskSteps.map((step, index) => {
          const { title, body } = step
          return Item({ title, body, index })
        })}
        <ButtonContainer>
          <Button onClick={() => handleRefresh()} label="Refresh" />
        </ButtonContainer>
      </Container>
    </Modal>
  )
}

export default React.memo(InstallMetaMaskModal)
