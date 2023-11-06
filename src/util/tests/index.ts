export const mockedInitialState = {
  ui: {
    theme: 'dark',
    networkPicker: false,
    transactionSuccess: false,
    noMetaMaskModal: false,
    installMetaMaskModal: false,
    settingsModal: false,
    switchNetworkModal: false,
  },
  network: {
    activeNetworkName: {
      l1: 'ethereum',
      l2: 'boba',
    },
    activeNetwork: 'ETHEREUM',
    activeNetworkType: 'Mainnet',
  },
  setup: {
    netLayer: 'L1',
  },
  bridge: {
    bridgeToAddressState: true,
    destChainIdTeleportation: 'ethereum',
    bridgeType: 'CLASSIC',
  },
}
