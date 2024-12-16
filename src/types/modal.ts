
// can use this to make code more readable.
export enum ModalIds {
  SettingModal = 'settingModal',
  StakeModal = 'StakeModal',
  UnStakeModal = 'UnStakeModal',
  NetworkSwitchModal = 'NetworkSwitchModal'
  // Add other modal IDs here as needed
}

export interface ModalConfig {
  title: string;
  subtitle?: string;
  titleStack?: boolean;
  icon?: React.ReactNode;
  content: React.ReactNode;
  actions?: {
    label: string;
    className?: string;
    onClick: () => void;
    variant?: 'default' | 'select' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  }[];
  onClose?: () => void;
}
