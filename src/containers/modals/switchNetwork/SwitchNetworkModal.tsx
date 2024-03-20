import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from 'components/global'
import Modal from 'components/modal/Modal'

import { setActiveNetwork } from 'actions/networkAction'
import { setBaseState, setConnect, setEnableAccount } from 'actions/setupAction'
import { closeModal } from 'actions/uiAction'

import { selectActiveNetworkType, selectNetwork } from 'selectors'
import { ModalInterface } from '../types'
import { chainNameMaps } from 'util/network/network.util'

const SwitchNetworkModal: React.FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const network = useSelector(selectNetwork())
  const networkType = useSelector(selectActiveNetworkType())

  const onClick = () => {
    dispatch(setActiveNetwork())
    dispatch(setBaseState(false))
    dispatch(setEnableAccount(false))
    dispatch(closeModal('switchNetworkModal'))
  }

  const handleClose = () => {
    dispatch(setConnect(false))
    dispatch(closeModal('switchNetworkModal'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Switch Network"
      testId="switch-network-modal"
    >
      <Button
        label={`Switch to ${chainNameMaps[network]} ${
          networkType === 'Testnet' ? networkType : ''
        } Network`}
        onClick={() => onClick()}
      />
    </Modal>
  )
}

export default React.memo(SwitchNetworkModal)
