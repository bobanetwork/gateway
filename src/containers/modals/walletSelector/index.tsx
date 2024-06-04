import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { closeModal } from 'actions/uiAction'
import { setConnectBOBA, setConnectETH, setConnect } from 'actions/setupAction'

import Modal from 'components/modal/Modal'
import { Typography } from 'components/global/typography'
import networkService from 'services/networkService'
import metaMaskLogo from 'assets/images/metamask.svg'
import walletConnectLogo from 'assets/images/walletconnect.svg'
import ArrowIcon from 'assets/images/icons/arrowright.svg'

import {
  Wallets,
  StyledWallet,
  Icon,
  ArrowContainer,
  IconContainer,
  StyledSvg,
} from './styles'

import { useWalletConnect } from 'hooks/useWalletConnect'
import { ModalInterface } from '../types'
import { WalletInterface, WalletType } from './types'

const Wallet: React.FC<WalletInterface> = ({
  onClick,
  iconSrc,
  title,
  showArrow = false,
  testid,
}) => (
  <StyledWallet onClick={onClick} data-testid={testid}>
    <IconContainer>
      <Icon src={iconSrc} alt={title.toLowerCase()} />
    </IconContainer>
    <Typography variant="title">{title}</Typography>
    {showArrow && (
      <ArrowContainer>
        <StyledSvg src={ArrowIcon} />
      </ArrowContainer>
    )}
  </StyledWallet>
)

const WalletSelectorModal: React.FC<ModalInterface> = ({ open }) => {
  const { triggerInit } = useWalletConnect()

  const dispatch = useDispatch<any>()

  const [walletNotFound, setWalletNotFound] = useState<boolean>(false)
  const modalTitle = walletNotFound ? 'No MetaMask Install' : 'Connect Wallet'

  const resetConnectChain = () => {
    dispatch(setConnectETH(false))
    dispatch(setConnectBOBA(false))
  }

  const connectToWallet = async (type: WalletType) => {
    try {
      const res = await networkService.walletService.connect(type)
      if (res) {
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

  const handleconnect = (type: WalletType) => {
    if ((window as any).ethereum) {
      connectToWallet(type)
    } else {
      setWalletNotFound(true)
    }
  }

  const handleClose = () => {
    dispatch(closeModal('walletSelectorModal'))
    dispatch(setConnect(false))
    resetConnectChain()
  }

  const handleInstall = () => {
    window.open('https://metamask.io/download/', '_blank')
    setWalletNotFound(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      newStyle={true}
      title={modalTitle}
      testId="walletselector-modal"
    >
      <Wallets>
        {walletNotFound && (
          <Wallet
            onClick={() => handleInstall()}
            iconSrc={metaMaskLogo}
            title="Download MetaMask wallet"
            testid={'metamask-is-not-installed'}
          />
        )}
        {!walletNotFound && (
          <>
            <Wallet
              onClick={() => handleconnect('metamask')}
              iconSrc={metaMaskLogo}
              title="MetaMask"
              showArrow
              testid={'metamask-link'}
            />
            <Wallet
              onClick={() => handleconnect('walletconnect')}
              iconSrc={walletConnectLogo}
              title="WalletConnect"
              showArrow
              testid={'walletconnect-link'}
            />
          </>
        )}
      </Wallets>
    </Modal>
  )
}

export default React.memo(WalletSelectorModal)
