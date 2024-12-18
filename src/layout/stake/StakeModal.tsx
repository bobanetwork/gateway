import Modal from '@/components/boba/Modal';
import { Button, Input, Text } from '@/components/ui';
import { useStakingActions } from '@/hooks/staking/useStakingActions';
import { useBalances } from '@/hooks/useTokenBalances';
import { useModalStore } from '@/stores/modal.store';
import { ModalConfig, ModalIds } from '@/types/modal';
import { formatNumberWithIntl } from '@/utils/format';
import { IconSquareX } from '@tabler/icons-react';
import { IconSquareCheck } from '@tabler/icons-react';
import { IconStackPush } from "@tabler/icons-react";
import React, { useState } from 'react';

interface StakeModalProps { }

const StakeModal: React.FC<StakeModalProps> = () => {
  const { isOpen, closeModal } = useModalStore();
  const [amountToStake, setAmountToStake] = useState('')
  const [modalState, setModalState] = useState('stake');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false)
  const { stake } = useStakingActions()

  const {
    tokenBalance
  } = useBalances();

  if (!isOpen(ModalIds.StakeModal)) {
    return null;
  }

  const handleStake = async () => {
    try {
      setIsProcessing(true);
      await stake(Number(amountToStake));
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
    closeModal(ModalIds.StakeModal)
    // Reset state when closing the modal
    setAmountToStake('')
    setModalState('stake')
    setError('')
    setIsProcessing(false)
  }

  const getModalConfig = (): ModalConfig => {
    const configs: Record<string, ModalConfig> = {
      'stake': {
        title: 'Stake',
        subtitle: "Stake Boba and earn rewards.",
        titleStack: true,
        icon: <IconStackPush />,
        content: (
          <div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Text variant="sm" fontWeight="medium" className="text-gray-800">Amount</Text>
                  <Text variant="sm" fontWeight='medium' className="text-gray-700">Balance: {formatNumberWithIntl(Number(tokenBalance), 3)} BOBA</Text>
                </div>
                {/* TODO: convert this to separate component with expected params. */}
                <div className="relative rounded-3xl border border-gray-500">
                  <Input
                    type="number"
                    step={0.1}
                    value={amountToStake}
                    onChange={(e) => setAmountToStake(e.target.value)}
                    min={0}
                    max={Number(tokenBalance)}
                    placeholder="Enter amount to stake"
                    className="pr-16 h-12 text-lg border-none w-full outline-none"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      // TODO: fix max token balance with function
                      // setAmountToStake()
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-700 rounded-full border border-gray-600 px-3 py-1">
                    Max
                  </Button>
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
                  <span>{amountToStake}</span>
                </div>
              </div>
            </div>
          </div>
        ),
        onClose,
        actions: [
          {
            label: isProcessing ? 'Processing...' : 'Stake',
            disabled: isProcessing || !amountToStake,
            onClick: handleStake,
          },
          {
            label: 'Cancel',
            variant: "outline",
            onClick: onClose,
          }
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

    return configs[modalState]
  }

  return (
    <Modal config={getModalConfig()} isOpen={true} />
  )
}

export default StakeModal