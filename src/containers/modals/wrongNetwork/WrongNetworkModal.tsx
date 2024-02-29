import React, { FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'components/modal/Modal'

import { setConnect, setConnectBOBA, setConnectETH } from 'actions/setupAction'
import { closeModal } from 'actions/uiAction'

import { Button } from 'components/global'
import { selectActiveNetworkType, selectLayer, selectNetwork } from 'selectors'
import { chainNameMaps } from 'util/network/network.util'
import walletService from 'services/wallet.service'

interface Props {
  open: boolean
}

const WrongNetworkModal: FC<Props> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const network = useSelector(selectNetwork())
  const networkType = useSelector(selectActiveNetworkType())
  const layer = useSelector(selectLayer())

  const handleClose = () => {
    dispatch(setConnect(false))
    walletService.resetValues()
    dispatch(closeModal('wrongNetworkModal'))
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      minHeight="180px"
      title="Wrong Network"
      transparent={false}
    >
      <Button
        label={`Connect to the ${chainNameMaps[network]} ${networkType} network`}
        onClick={() => {
          if (layer === 'L2') {
            dispatch(setConnectBOBA(true))
          } else {
            dispatch(setConnectETH(true))
          }
          dispatch(closeModal('wrongNetworkModal'))
        }}
      />
    </Modal>
  )
}

export default React.memo(WrongNetworkModal)
