import Modal from '@/components/boba/Modal';
import { Label, Switch, Text } from '@/components/ui';
import { useModalStore } from '@/stores/modal.store';
import { useSettingsStore } from '@/stores/settings.store';
import { ModalConfig, ModalIds } from '@/types/modal';
import { IconStackPush } from "@tabler/icons-react";
import React from 'react';

interface StakeModalProps { }

const StakeModal: React.FC<StakeModalProps> = () => {
  const { isOpen, closeModal } = useModalStore();
  const {
    showTestnet,
    showDestinationAddress,
    setShowTestnet,
    setShowDestinationAddress
  } = useSettingsStore();

  const stakeModalConfig: ModalConfig = {
    title: 'Stake',
    icon: <IconStackPush />,
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