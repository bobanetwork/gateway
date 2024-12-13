
// can use this to make code more readable.
export enum ModalIds {
  SettingModal = 'settingModal',
  StakeModal = 'StakeModal',
  UnStakeModal = 'UnStakeModal',
  // Add other modal IDs here as needed
}

export interface ModalConfig {
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'select' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  }[];
  onClose?: () => void;
}