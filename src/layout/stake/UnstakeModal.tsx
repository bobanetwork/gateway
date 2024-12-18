import Modal from '@/components/boba/Modal';
import { Input, Text } from '@/components/ui';
import { useUnstakingActions } from '@/hooks/staking/useUnstakingActions';
import { useModalStore } from '@/stores/modal.store';
import { useStakingStore } from '@/stores/stake.store';
import { ModalConfig, ModalIds } from '@/types/modal';
import { formatNumberWithIntl } from '@/utils/format';
import { IconSquareCheck } from '@tabler/icons-react';
import { IconSquareX } from '@tabler/icons-react';
import { IconStackPop } from "@tabler/icons-react";
import React, { useState } from 'react';

const UnStakeModal: React.FC = () => {
  const { isOpen, closeModal } = useModalStore();
  const { selectedStake } = useStakingStore()
  const [modalState, setModalState] = useState('unstake');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false)
  const { unstake } = useUnstakingActions()

  if (!isOpen(ModalIds.UnStakeModal) || !modalState) {
    return null;
  }

  const handleUnstake = async () => {
    try {
      setIsProcessing(true);
      await unstake(selectedStake.stakeId);
      setIsProcessing(false);
      setModalState('success');
    } catch (error) {
      if ((error as any).message.includes('User rejected the request')) {
        setError('User rejected the request')
      }
      console.log(`message`, (error as any).message);
      setModalState('failed');
    }
  }

  const onClose = () => {
    closeModal(ModalIds.UnStakeModal)
    setModalState('unstake')
    setError('')
    setIsProcessing(false)
  }

  const getModalConfig = (): ModalConfig => {

    const configs: Record<string, ModalConfig> = {
      'unstake': {
        title: 'Unstake',
        subtitle: 'You can only unstake during unstaking window.',
        titleStack: true,
        icon: <IconStackPop />,
        content: (
          <div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Text variant="sm" fontWeight="medium" className="text-gray-800">Amount</Text>
                  <Text variant="sm" fontWeight='medium' className="text-gray-700">Available Stake: {formatNumberWithIntl(Number(selectedStake.depositAmount), 2)} BOBA</Text>
                </div>
                <div className="relative rounded-3xl border border-gray-500">
                  <Input
                    type="text"
                    placeholder="0.00"
                    className="pr-16 h-12 text-lg border-none w-full outline-none"
                    disabled
                    value={selectedStake.depositAmount}
                  />
                </div>
              </div>
              <div className="border border-gray-600 rounded-3xl px-5 py-3 space-y-2">
                <div className="flex justify-between">
                  <Text variant="sm" fontWeight="normal">Fee</Text>
                  <span>0 ETH</span>
                </div>
                <div className="flex justify-between">
                  <Text variant="sm" fontWeight="normal">APY</Text>
                  <span>5.0%</span>
                </div>
                <div className="flex justify-between">
                  <Text variant="sm" fontWeight="normal">Total</Text>
                  <span>{selectedStake.depositAmount}</span>
                </div>
              </div>
            </div>
          </div>
        ),
        onClose,
        actions: [
          {
            label: isProcessing ? 'Processing...' : 'UnStake',
            disabled: isProcessing,
            onClick: handleUnstake,
          },
          {
            label: 'Cancel',
            variant: "outline",
            onClick: onClose,
          },
        ],
      },
      'success': {
        title: '',
        onClose,
        content: (
          <div className="flex flex-col justify-center items-center p-2 gap-3">
            <IconSquareCheck className="h-14 w-14 text-green-400 dark:text-dark-green-300" />
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Success</Text>
            <Text variant="sm" fontWeight="medium">Your Boba token has been staked!</Text>
          </div>
        ),
        actions: [
          {
            label: 'Done',
            className: "w-80",
            onClick: onClose,
          }
        ]
      },
      'failed': {
        title: '',
        onClose,
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-4">
            <IconSquareX className="h-14 w-14 text-green-400 dark:text-dark-green-300" />
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Failed to stake!</Text>
            <Text variant="sm" fontWeight="medium">{error || 'Something went wrong!'}</Text>
          </div>
        ),
        actions: [
          {
            label: 'Close',
            onClick: onClose,
          }
        ]
      }
    }

    return configs[modalState];
  }


  return (
    <Modal config={getModalConfig()} isOpen={true} />
  )
}

export default UnStakeModal