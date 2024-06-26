import React from 'react'
import { useSelector } from 'react-redux'
import { selectModalState } from 'selectors'
import CastVoteModal from './DaoModals/CastVoteModal'
import NewProposalModal from './DaoModals/NewProposalModal'
import DelegateDaoModal from './DaoModals/DelegateDaoModal'

import EarnWithdrawModal from './earn'
import EarnWithdrawConfirmModal from './earn/EarnWithdrawConfirmModal'
import EarnWithdrawModalSuccessModal from './earn/EarnWithdrawSuccess'
import InstallMetaMaskModal from './noMetaMask/InstallMetaMaskModal/InstallMetaMaskModal'
import NoMetaMaskModal from './noMetaMask/NoMetaMaskModal'
import SwitchNetworkModal from './switchNetwork/SwitchNetworkModal'
import TokenPickerModal from './tokenPicker/TokenPickerModal'
import WrongNetworkModal from './wrongNetwork/WrongNetworkModal'
import WalletSelectorModal from './walletSelector/'
import DepositStake from './stake/DepositStake'
import SettingsModal from './settings'
import NetworkPickerModal from './networkPicker'
import BridgeConfirmModal from './BridgeConfirmModal'
import BridgeInProgressModal from './BridgeInProgressModal'
import TransactionSuccessModal from './TransactionSuccessModal'
import UnsupportedNetworkModal from './UnsupportedNetworkModal'
import { MultiStepWithdrawalModal } from './MultiStepWithdrawalModal'
/**
 *
 * NOTE:TODO: https://github.com/bobanetwork/boba/pull/982#discussion_r1253868688
 */

const ModalContainer = () => {
  const UnsupportedNetworkModalState = useSelector(
    selectModalState('UnsupportedNetwork')
  )

  const earnWithdrawModalSuccessModalState = useSelector(
    selectModalState('EarnWithdrawModalSuccess')
  )

  const earnWithdrawConfirmModalState = useSelector(
    selectModalState('EarnWithdrawConfirmModal')
  )

  const tokenPickerModalState = useSelector(selectModalState('tokenPicker'))

  const wrongNetworkModalState = useSelector(
    selectModalState('wrongNetworkModal')
  )
  const noMetaMaskModalState = useSelector(selectModalState('noMetaMaskModal'))
  const installMetaMaskModalState = useSelector(
    selectModalState('installMetaMaskModal')
  )
  const walletSelectorModalState = useSelector(
    selectModalState('walletSelectorModal')
  )

  const switchNetworkModalState = useSelector(
    selectModalState('switchNetworkModal')
  )
  const SettingsModalState = useSelector(selectModalState('settingsModal'))
  const tokenIndex = useSelector(selectModalState('tokenIndex'))
  const proposalId = useSelector(selectModalState('proposalId'))
  const destNetworkSelection = useSelector(
    selectModalState('destNetworkSelection')
  )

  const StakeDepositModalState = useSelector(
    selectModalState('StakeDepositModal')
  )

  const EarnWithdrawModalState = useSelector(
    selectModalState('EarnWithdrawModal')
  )

  const delegateBobaDaoModalState = useSelector(
    selectModalState('delegateDaoModal')
  )

  const proposalBobaDaoModalState = useSelector(
    selectModalState('newProposalModal')
  )
  const castVoteModalState = useSelector(selectModalState('castVoteModal'))

  const networkPickerModalState = useSelector(selectModalState('networkPicker'))

  const bridgeConfirmModalState = useSelector(
    selectModalState('bridgeConfirmModal')
  )

  const bridgeMultiStepModalState = useSelector(
    selectModalState('bridgeMultiStepWithdrawal')
  )

  const isNewTx = useSelector(selectModalState('isNewTx'))

  const bridgeInProgressModalState = useSelector(
    selectModalState('bridgeInProgress')
  )

  const transactionSuccessModalState = useSelector(
    selectModalState('transactionSuccess')
  )

  const isAnchorageWithdrawal = useSelector(
    selectModalState('isAnchorageWithdrawal')
  )

  return (
    <>
      {!!UnsupportedNetworkModalState && (
        <UnsupportedNetworkModal open={UnsupportedNetworkModalState} />
      )}

      {!!EarnWithdrawModalState && (
        <EarnWithdrawModal open={EarnWithdrawModalState} />
      )}
      {!!earnWithdrawConfirmModalState && (
        <EarnWithdrawConfirmModal open={earnWithdrawConfirmModalState} />
      )}
      {!!earnWithdrawModalSuccessModalState && (
        <EarnWithdrawModalSuccessModal
          open={earnWithdrawModalSuccessModalState}
        />
      )}
      {!!StakeDepositModalState && (
        <DepositStake open={StakeDepositModalState} />
      )}
      {!!delegateBobaDaoModalState && (
        <DelegateDaoModal open={delegateBobaDaoModalState} />
      )}
      {!!proposalBobaDaoModalState && (
        <NewProposalModal open={proposalBobaDaoModalState} />
      )}
      {!!castVoteModalState && (
        <CastVoteModal open={castVoteModalState} proposalId={proposalId} />
      )}
      {!!tokenPickerModalState && (
        <TokenPickerModal
          tokenIndex={tokenIndex}
          open={tokenPickerModalState}
        />
      )}

      {!!wrongNetworkModalState && (
        <WrongNetworkModal open={wrongNetworkModalState} />
      )}
      {!!noMetaMaskModalState && (
        <NoMetaMaskModal open={noMetaMaskModalState} />
      )}
      {!!installMetaMaskModalState && (
        <InstallMetaMaskModal open={installMetaMaskModalState} />
      )}
      {!!walletSelectorModalState && (
        <WalletSelectorModal open={walletSelectorModalState} />
      )}

      {!!switchNetworkModalState && (
        <SwitchNetworkModal open={switchNetworkModalState} />
      )}
      {!!SettingsModalState && <SettingsModal open={SettingsModalState} />}
      {!!networkPickerModalState && (
        <NetworkPickerModal
          open={networkPickerModalState}
          destNetworkSelection={destNetworkSelection}
        />
      )}

      {!!bridgeConfirmModalState && (
        <BridgeConfirmModal open={bridgeConfirmModalState} />
      )}

      {!!bridgeMultiStepModalState && (
        <MultiStepWithdrawalModal
          open={bridgeMultiStepModalState}
          isNewTx={isNewTx}
        />
      )}

      {!!bridgeInProgressModalState && (
        <BridgeInProgressModal open={bridgeInProgressModalState} />
      )}

      {!!transactionSuccessModalState && (
        <TransactionSuccessModal
          open={transactionSuccessModalState}
          anchorageWithdraw={isAnchorageWithdrawal}
        />
      )}
    </>
  )
}

export default ModalContainer
