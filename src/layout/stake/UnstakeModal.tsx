import Modal from '@/components/boba/Modal';
import { Label, Switch, Text } from '@/components/ui';
import { useModalStore } from '@/stores/modal.store';
import { useSettingsStore } from '@/stores/settings.store';
import { ModalConfig, ModalIds } from '@/types/modal';
import { IconStackPop } from "@tabler/icons-react";
import React from 'react';

interface UnStakeModalProps { }

const UnStakeModal: React.FC<UnStakeModalProps> = () => {
  const { isOpen, closeModal } = useModalStore();
  const {
    showTestnet,
    showDestinationAddress,
    setShowTestnet,
    setShowDestinationAddress
  } = useSettingsStore();

  const unstakeModalConfig: ModalConfig = {
    title: 'Unstake',
    icon: <IconStackPop />,
    content: (
      <div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch
              id="show-testnet"
              checked={showTestnet}
              onCheckedChange={setShowTestnet}
            />
            <div className="flex flex-col items-start justify-start">
              <Label htmlFor="show-testnet">
                <Text fontWeight="bold" variant="sm">
                  Show Testnet
                </Text>
                <Text variant="sm" fontWeight="light">
                  Testnets will be available to bridge
                </Text>
              </Label>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Switch
              id="destination-address"
              checked={showDestinationAddress}
              onCheckedChange={setShowDestinationAddress}
            />
            <div className="flex flex-col items-start justify-start">
              <Label htmlFor="destination-address">
                <Text fontWeight="bold" variant="sm">
                  Add Destination Address
                </Text>
                <Text variant="sm" fontWeight="light">
                  Testnets will be available to bridge
                </Text>
              </Label>
            </div>
          </div>
        </div>
      </div>
    ),
    onClose: () => closeModal(ModalIds.UnStakeModal),
    actions: [
      {
        label: 'Unstake',
        onClick: () => {
          // Settings are automatically saved due to persist middleware
          closeModal(ModalIds.UnStakeModal);
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

  if (!isOpen(ModalIds.UnStakeModal)) {
    return null;
  }

  return (
    <Modal config={unstakeModalConfig} isOpen={true} />
  )
}

export default UnStakeModal