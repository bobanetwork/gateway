import { Text } from '@/components/ui';
import { ModalConfig } from '@/types/modal';
import { NetworkSwitchState } from '@/types/network';
import { IconAlertTriangle, IconSquareCheck, IconSquareX, IconSwitchHorizontal } from '@tabler/icons-react';
import React from 'react';
import { Chain } from 'wagmi/chains';
import Modal from '../Modal';

interface NetworkSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: NetworkSwitchState;
  targetChain?: Chain;
  error?: string;
  onConfirm: () => void;
  onAddNetwork?: () => void;
}

export const NetworkSwitchModal: React.FC<NetworkSwitchModalProps> = ({
  isOpen,
  onClose,
  state,
  targetChain,
  onConfirm,
  onAddNetwork,
}) => {
  const getModalConfig = (): ModalConfig => {
    const configs: Record<NetworkSwitchState, ModalConfig> = {
      'idle': {
        title: '',
        content: '',
      },
      'confirming': {
        title: '',
        onClose,
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-4">
            <div className="p-1 border-2 border-green-300 bg-green-50 dark:bg-dark-green-500  rounded-sm text-green-400 dark:text-dark-green-300">
              <IconSwitchHorizontal className="h-8 w-8" />
            </div>
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Switch Network</Text>
            <Text variant="sm" fontWeight="medium">Would you like to switch to
              <span className="pl-1 font-semibold">{`${targetChain?.name}`}?</span>
            </Text>
          </div>
        ),
        actions: [{
          label: 'Confirm',
          onClick: onConfirm,
        },
        {
          label: 'Cancel',
          variant: "outline",
          onClick: onClose,
        }]
      },
      'switching': {
        title: '',
        onClose,
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-4">
            <div className="mx-auto flex items-center justify-center h-24 w-24">
              <div className="animate-spin rounded-full h-24 w-24 border-[10px] border-green-300 border-l-transparent border-t-transparent"></div>
            </div>
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Switching network</Text>
            <Text variant="sm" fontWeight="medium">Please wait while we switch to
              <span className="pl-1 font-semibold">{`${targetChain?.name}`}?</span>
            </Text>
          </div>
        ),
      },
      'success': {
        title: '',
        onClose,
        content: (
          <div className="flex flex-col justify-center items-center p-2 gap-3">
            <IconSquareCheck className="h-14 w-14 text-green-400 dark:text-dark-green-300" />
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Successful</Text>
            <Text variant="sm" fontWeight="medium">Successfully switched to
              <span className="pl-1 font-semibold">{`${targetChain?.name}`}</span>
            </Text>
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
      'chain-not-found': {
        title: '',
        onClose,
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-3">
            <IconAlertTriangle className="h-14 w-14 text-red-300 dark:text-dark-red-300" />
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Network Not Found!</Text>
            <Text variant="sm" fontWeight="medium" className="text-center">
              Would you like to add
              <span className="px-1 font-semibold">{targetChain?.name}</span>
              to your wallet?
            </Text>
          </div>
        ),
        actions: [{
          label: 'Add Network',
          onClick: () => {
            if (onAddNetwork) {
              onAddNetwork()
            }
          },
        }, {
          label: 'Cancel',
          variant: "outline",
          onClick: onClose,
        },]
      },
      'failed': {
        title: '',
        onClose,
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-4">
            <IconSquareX className="h-14 w-14 text-green-400 dark:text-dark-green-300" />
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Failed to switch</Text>
            <Text variant="sm" fontWeight="medium">{`Something went wrong while switching networks`}</Text>
          </div>
        ),
        actions: [{
          label: 'Close',
          onClick: onClose,
        },]
      },
    };

    return configs[state];
  };

  return (
    <Modal
      isOpen={isOpen}
      config={getModalConfig()}
    />
  );
};
