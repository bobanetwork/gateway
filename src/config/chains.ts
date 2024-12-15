export enum ChainType {
  L1 = 'L1',
  L2 = 'L2'
}

export interface ChainConfig {
  id: number;
  name: string;
  type: ChainType;
  isTestnet: boolean;
  stakingEnabled: boolean;
  // Add other chain-specific configurations as needed
}

export const CHAIN_CONFIGS: { [chainId: number]: ChainConfig } = {
  // Ethereum Mainnet
  1: {
    id: 1,
    name: 'Ethereum',
    type: ChainType.L1,
    isTestnet: false,
    stakingEnabled: false
  },
  // BOBA L2 Mainnet
  288: {
    id: 288,
    name: 'Boba Network',
    type: ChainType.L2,
    isTestnet: false,
    stakingEnabled: true
  },
  // BOBA BNB Mainnet
  56288: {
    id: 56288,
    name: 'Boba BNB',
    type: ChainType.L2,
    isTestnet: false,
    stakingEnabled: false
  },
  // Add testnet configurations
  // Goerli Testnet
  5: {
    id: 5,
    name: 'Goerli',
    type: ChainType.L1,
    isTestnet: true,
    stakingEnabled: false
  },
  // BOBA Goerli
  2888: {
    id: 2888,
    name: 'Boba Goerli',
    type: ChainType.L2,
    isTestnet: true,
    stakingEnabled: false
  }
  // Add more chains as needed
};
