import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletConnect } from 'hooks/useWalletConnect'

import Modal from 'components/modal/Modal'

import { closeModal } from 'actions/uiAction'
import {
  setConnectBOBA,
  setConnectETH,
  setConnect,
} from 'actions/setupAction.js'
import { Typography } from 'components/global/typography'
import networkService from 'services/networkService'

import metaMaskLogo from 'assets/images/metamask.svg'
import walletConnectLogo from 'assets/images/walletconnect.svg'
import ArrowIcon from 'assets/images/icons/arrowright.svg'

import { ModalInterface } from '../types'
import {
  Wallets,
  Wallet,
  Icon,
  ArrowContainer,
  IconContainer,
  StyledSvg,
} from './styles'

const WalletSelectorModal: React.FC<ModalInterface> = ({ open }) => {
  const dispatch = useDispatch<any>()

  const { triggerInit } = useWalletConnect()
  const [walletNotFound, setWalletNotFound] = useState(false)

  const connectToWallet = async (type) => {
    const resetConnectChain = () => {
      dispatch(setConnectETH(false))
      dispatch(setConnectBOBA(false))
    }

    try {
      if (await networkService.walletService.connectWallet(type)) {
        dispatch(closeModal('walletSelectorModal'))
        triggerInit()
      } else {
        resetConnectChain()
      }
    } catch (error) {
      console.log(`Error connecting wallet: ${error}`)
      resetConnectChain()
    }
  }

  const handleClose = () => {
    dispatch(closeModal('walletSelectorModal'))
    dispatch(setConnect(false))
    dispatch(setConnectETH(false))
    dispatch(setConnectBOBA(false))
  }

  const handleSetWallet = () => {
    if (window?.ethereum) {
      connectToWallet('metamask')
    } else {
      setWalletNotFound(true)
    }
  }

  const handleWalletClick = () => {
    window.open('https://metamask.io/download/', '_blank')
    setWalletNotFound(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={walletNotFound ? 'No MetaMask Install' : 'Connect Wallet'}
    >
      {walletNotFound ? (
        <Wallets>
          <Wallet onClick={() => handleWalletClick()}>
            <IconContainer>
              <Icon src={metaMaskLogo} alt="metamask" />
            </IconContainer>
            <Typography variant="title">Download MetaMask wallet</Typography>
          </Wallet>
        </Wallets>
      ) : (
        <Wallets>
          <Wallet onClick={() => handleSetWallet()}>
            <IconContainer>
              <Icon src={metaMaskLogo} alt="metamask" />
            </IconContainer>
            <Typography variant="title">MetaMask</Typography>
            <ArrowContainer>
              <StyledSvg src={ArrowIcon} />
            </ArrowContainer>
          </Wallet>
          <Wallet onClick={() => connectToWallet('walletconnect')}>
            <IconContainer>
              <Icon src={walletConnectLogo} alt="walletconnect" />
            </IconContainer>
            <Typography variant="title">WalletConnect</Typography>
            <ArrowContainer>
              <StyledSvg src={ArrowIcon} />
            </ArrowContainer>
          </Wallet>
        </Wallets>
      )}
    </Modal>
  )
}

export default React.memo(WalletSelectorModal)
