export const mockedInitialState = {
  ui: {
    theme: 'dark',
    networkPicker: false,
    transactionSuccess: false,
    noMetaMaskModal: false,
    installMetaMaskModal: false,
    settingsModal: false,
    switchNetworkModal: false,
    EarnWithdrawModalSuccess: false,
    EarnWithdrawConfirmModal: false,
    walletSelectorModal: false,
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
    layer1: [
      {
        address: '0x0000000000000000000000000000000000000000',
        addressL2: '0x4200000000000000000000000000000000000006',
        currency: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        decimals: 18,
        balance: '0b192bb6bb215a4e',
      },
      {
        currency: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        addressL1: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        addressL2: '0x429582bde1b0e011c48d883354050938f194743f',
        symbolL1: 'USDC',
        symbolL2: 'USDC',
        decimals: 6,
        name: 'USD Coin',
        redalert: false,
        balance: '00',
        layer: 'L1',
        address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        symbol: 'USDC',
      },
      {
        currency: '0xcb9b561c91dda1a9bac33f7716a4d5586b7f5649',
        addressL1: '0xcb9b561c91dda1a9bac33f7716a4d5586b7f5649',
        addressL2: '0x080bf38b43a1441873116002d36ccb583464cf45',
        symbolL1: 'OMG',
        symbolL2: 'OMG',
        decimals: 18,
        name: 'OMG Token',
        redalert: false,
        balance: '00',
        layer: 'L1',
        address: '0xcb9b561c91dda1a9bac33f7716a4d5586b7f5649',
        symbol: 'OMG',
      },
      {
        currency: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
        addressL1: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
        addressL2: '0x4200000000000000000000000000000000000023',
        symbolL1: 'BOBA',
        symbolL2: 'BOBA',
        decimals: 18,
        name: 'Boba Token',
        redalert: false,
        balance: '14ecd38f9eeeaea000',
        layer: 'L1',
        address: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
        symbol: 'BOBA',
      },
    ],
    layer2: [
      {
        address: '0x4200000000000000000000000000000000000006',
        addressL1: '0x0000000000000000000000000000000000000000',
        addressL2: '0x4200000000000000000000000000000000000006',
        currency: '0x0000000000000000000000000000000000000000',
        symbol: 'ETH',
        decimals: 18,
        balance: '02cb3465c20b9800',
      },
      {
        currency: '0x01c9dc8b9c66d61a56db7bf3f5303cd9e9c85b1f',
        addressL1: 'xboba',
        addressL2: '0x01c9dc8b9c66d61a56db7bf3f5303cd9e9c85b1f',
        symbolL1: 'xBOBA',
        symbolL2: 'xBOBA',
        decimals: 18,
        name: 'xBOBA Token',
        redalert: false,
        balance: '0254d40124fa730000',
        layer: 'L2',
        address: '0x01c9dc8b9c66d61a56db7bf3f5303cd9e9c85b1f',
        symbol: 'xBOBA',
      },
      {
        currency: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        addressL1: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        addressL2: '0x429582bde1b0e011c48d883354050938f194743f',
        symbolL1: 'USDC',
        symbolL2: 'USDC',
        decimals: 6,
        name: 'USD Coin',
        redalert: false,
        balance: '00',
        layer: 'L2',
        address: '0x429582bde1b0e011c48d883354050938f194743f',
        symbol: 'USDC',
      },
      {
        currency: '0xcb9b561c91dda1a9bac33f7716a4d5586b7f5649',
        addressL1: '0xcb9b561c91dda1a9bac33f7716a4d5586b7f5649',
        addressL2: '0x080bf38b43a1441873116002d36ccb583464cf45',
        symbolL1: 'OMG',
        symbolL2: 'OMG',
        decimals: 18,
        name: 'OMG Token',
        redalert: false,
        balance: '00',
        layer: 'L2',
        address: '0x080bf38b43a1441873116002d36ccb583464cf45',
        symbol: 'OMG',
      },
      {
        currency: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
        addressL1: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
        addressL2: '0x4200000000000000000000000000000000000023',
        symbolL1: 'BOBA',
        symbolL2: 'BOBA',
        decimals: 18,
        name: 'Boba Token',
        redalert: false,
        balance: '01e7ce5b2d626cbf9000',
        layer: 'L2',
        address: '0x4200000000000000000000000000000000000023',
        symbol: 'BOBA',
      },
    ],
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
  earn: {
    poolInfo: {
      L1LP: {},
      L2LP: {},
    },
    userInfo: {
      L1LP: {},
      L2LP: {},
    },
    withdrawPayload: {},
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
