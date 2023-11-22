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
    activeNetworkIcon: 'ethereum',
  },
  balance: {
    l2FeeRateN: 2,
  },
  setup: {
    netLayer: 'L1',
  },
  bridge: {
    bridgeToAddressState: false,
    bridgeDestinationAddress: '',
    destChainIdTeleportation: 'ethereum',
    bridgeType: 'CLASSIC',
    tokens: [
      {
        symbol: 'ETH',
        decimals: 18,
        address: '0x0000000000000000000000000000000000000000',
      },
    ],
    amountToBridge: '1.255',
    alerts: [],
  },
}

export const mockLocalStorage = (() => {
  let store = {}

  return {
    getItem: (key) => {
      if (Object.keys(store).length > 0) {
        if (store[key] === undefined) {
          return false
        }
        return store[key]
      }
      return false
    },

    setItem: (key, value) => {
      store[key] = value
    },

    clear: () => {
      store = {}
    },

    removeItem: (key) => {
      delete store[key]
    },

    getAll: () => {
      return store
    },
  }
})()

export type EnvType = string | number | null | undefined

export const DISABLE_WALLETCONNECT: EnvType = 'true'
