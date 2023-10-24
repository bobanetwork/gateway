export const mockedInitialState = {
  ui: {
    theme: 'light',
    networkPicker: false,
    transactionSuccess: false,
    noMetaMaskModal: false,
    installMetaMaskModal: false,
    walletSelectorModal: false,
  },
  network: {
    activeNetworkName: {
      l1: 'ethereum',
      l2: 'boba',
    },
    activeNetworkType: 'Mainnet',
  },
  setup: {
    netLayer: 'L1',
  },
  bridge: {
    destChainIdTeleportation: 'ethereum',
    bridgeType: 'CLASSIC',
  },
}
