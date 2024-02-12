import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Modal from 'components/modal/Modal'

import { setConnect, setConnectBOBA, setConnectETH } from 'actions/setupAction'
import { closeModal } from 'actions/uiAction'

import { Button } from 'components/global'
import { selectActiveNetworkType, selectLayer, selectNetwork } from 'selectors'
import { Network } from 'util/network/network.util'

interface Props {
  open: boolean
}

const chainCopy: Record<Network, string> = {
  ETHEREUM: 'Ethereum',
  ETHEREUM_SEPOLIA: 'Ethereum Sepolia',
  BNB: 'Bnb',
  OPTIMISM: 'Optimism',
  ARBITRUM: 'Arbitrum',
}

const WrongNetworkModal: FC<Props> = ({ open }) => {
  const dispatch = useDispatch<any>()
  const network = useSelector(selectNetwork())
  const networkType = useSelector(selectActiveNetworkType())
  const layer = useSelector(selectLayer())

  const handleClose = () => {
    dispatch(setConnect(false))
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
        label={`Connect to the ${chainCopy[network]} ${networkType} network`}
        onClick={() => {
          if (layer === 'L2') {
            dispatch(setConnectBOBA(true))
          } else {
            dispatch(setConnectETH(true))
          }
          dispatch(closeModal('settingsModal'))
        }}
      />
    </Modal>
  )
}

export default React.memo(WrongNetworkModal)
