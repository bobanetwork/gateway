import { NetworkSwitchState } from '@/types/network';
import React from 'react';
import { Chain } from 'wagmi/chains';
import Modal from '../Modal';
import { ModalConfig } from '@/types/modal';
import { IconAlertCircle, IconAlertTriangle, IconSquare, IconSquareCheck, IconSquareX, IconSwitchHorizontal } from '@tabler/icons-react';
import { Text } from '@/components/ui';

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
  error,
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
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-4">
            <div className="p-1 border-2 border-green-300 bg-green-50 dark:bg-dark-green-500  rounded-sm text-green-400 dark:text-dark-green-300">
              <IconSwitchHorizontal className="h-8 w-8" />
            </div>
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Switch Network</Text>
            <Text variant="sm" fontWeight="medium">{`Would you like to switch to ${targetChain?.name}?`}</Text>
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
        title: 'Switching Network',
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-4">
            <div className="mx-auto flex items-center justify-center h-24 w-24">
              <div className="animate-spin rounded-full h-24 w-24 border-[10px] border-green-300 border-l-transparent border-t-transparent"></div>
            </div>
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Switching network</Text>
            <Text variant="sm" fontWeight="medium">{`Please wait while we switch to ${targetChain?.name}`}</Text>
          </div>
        ),
      },
      'success': {
        title: '',
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-3">
            <IconSquareCheck className="h-14 w-14 text-green-400 dark:text-dark-green-300" />
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Successful</Text>
            <Text variant="sm" fontWeight="medium">{`Successfully switched to ${targetChain?.name}`}</Text>
          </div>
        ),
        actions: [{
          label: 'Close',
          onClick: onClose,
        },]
      },
      'chain-not-found': {
        title: '',
        content: (
          <div className="flex flex-col justify-center items-center p-4 gap-3">
            <IconAlertTriangle className="h-14 w-14 text-red-300 dark:text-dark-red-300" />
            <Text variant="lg" fontWeight="bold" fontFamily="montserrat" className="text-gray-800 dark:text-dark-gray-50">Network Not Found!</Text>
            <Text variant="sm" fontWeight="medium">{`Would you like to add ${targetChain?.name} to your wallet?`}</Text>
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
          onClick: onClose,
        },]
      },
      'failed': {
        title: '',
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
