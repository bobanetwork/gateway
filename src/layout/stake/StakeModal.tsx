import Modal from '@/components/boba/Modal';
import { Input, Text } from '@/components/ui';
import { useBalances } from '@/hooks/useTokenBalances';
import { useModalStore } from '@/stores/modal.store';
import { ModalConfig, ModalIds } from '@/types/modal';
import { formatNumberWithIntl } from '@/utils/format';
import { IconStackPush } from "@tabler/icons-react";
import React from 'react';

interface StakeModalProps { }

const StakeModal: React.FC<StakeModalProps> = () => {
  const { isOpen, closeModal } = useModalStore();
  const {
    tokenBalance
  } = useBalances();

  const stakeModalConfig: ModalConfig = {
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
            <div className="relative rounded-3xl border border-gray-500">
              <Input
                type="text"
                placeholder="0.00"
                className="pr-16 h-12 text-lg border-none w-full outline-none"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-700 rounded-full border border-gray-600 px-3 py-1">
                Max
              </button>
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
              <span>-</span>
            </div>
          </div>
        </div>
      </div>
    ),
    onClose: () => closeModal(ModalIds.StakeModal),
    actions: [
      {
        label: 'Stake',
        onClick: () => {
          // Settings are automatically saved due to persist middleware
          closeModal(ModalIds.StakeModal);
        },
      },
      {
        label: 'Cancel',
        variant: "outline",
        onClick: () => {
          // Settings are automatically saved due to persist middleware
          closeModal(ModalIds.StakeModal);
        },
      },
    ],
  }

  if (!isOpen(ModalIds.StakeModal)) {
    return null;
  }

  return (
    <Modal config={stakeModalConfig} isOpen={true} />
  )
}

export default StakeModal