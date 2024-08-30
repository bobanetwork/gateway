import { providers, utils } from 'ethers'
import walletService from './wallet.service'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import store from 'store'

const ACCOUNT_ADDRESS = '0xcF044AB1e5b55203dC258F47756daFb7F8F01760'

jest.mock('@walletconnect/ethereum-provider', () => {
  return {
    EthereumProvider: {
      init: jest.fn(),
    },
  }
})

jest.mock('./networkService', () => {
  return {
    networkConfig: {
      L1: {
        chainId: 1,
      },
    },
  }
})

jest.mock('store', () => {
  return {
    dispatch: jest.fn(),
  }
})

jest.mock('@bobanetwork/sdk', () => {
  return {
    CrossChainMessenger: jest.fn(),
  }
})

jest.mock('ethers', () => {
  return {
    providers: {
      Web3Provider: jest.fn(),
    },
    utils: {
      getAddress: jest.fn(),
    },
  }
})

const mockOn = jest.fn()
const mockConnect = jest.fn()
const mockEnable = jest.fn()
const mockRequest = jest.fn()
const mockDisconnect = jest.fn().mockResolvedValue(true)

const mockReload = jest.fn()

Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    reload: mockReload,
  },
})

describe('WalletService', () => {
  const wsInstance = walletService
  let ethereumMock: any
  afterEach(() => {
    jest.restoreAllMocks()
  })
  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })
    ethereumMock = {
      request: jest.fn(),
      on: jest.fn(),
    }
    ;(global as any).window.ethereum = ethereumMock
    // @ts-ignore
    providers.Web3Provider.mockImplementation(() => {
      return {
        getNetwork: jest.fn().mockResolvedValue({ chainId: '56' }),
        getSigner: jest.fn(() => ({
          getAddress: jest.fn().mockResolvedValue(ACCOUNT_ADDRESS), // Replace with your desired address
        })),
      }
    })
  })

  test('connect / disconnect should invoke functions correct based on type', async () => {
    // setup
    ;(EthereumProvider.init as jest.MockedFunction<any>).mockResolvedValue({
      on: mockOn,
      connect: mockConnect,
      enable: mockEnable,
      disconnect: mockDisconnect,
      request: mockRequest,
    })

    // test
    await wsInstance.connect('metamask')
    expect(window.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
    })

    await wsInstance.disconnect()
    expect(window.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }],
    })
    await wsInstance.connect('walletconnect')
    await wsInstance.disconnect()
    expect(mockDisconnect).toHaveBeenCalled()

    expect(window.ethereum.request).toHaveBeenCalledTimes(2)
    expect(mockDisconnect).toHaveBeenCalledTimes(1)
    expect(EthereumProvider.init).toHaveBeenCalledTimes(1)
  })

  test('should switch chain', async () => {
    await wsInstance.connect('metamask')
    const res = await wsInstance.switchChain(5, {})
    expect(window.ethereum.request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: 5 }],
    })
    expect(res).toBe(true)
  })

  test('should add chain in case of error on switching', async () => {
    ;(window.ethereum.request as any).mockRejectedValue({ code: 4902 })
    await wsInstance.connect('metamask')
    await wsInstance.switchChain(5, {})
    expect(window.ethereum.request).toHaveBeenCalledWith({
      method: 'eth_requestAccounts',
    })
    await wsInstance.disconnect()
    // test for random code on error.
    ;(window.ethereum.request as any).mockRejectedValue({ code: 4901 })
    await wsInstance.connect('metamask')
    const res = await wsInstance.switchChain(5, {})
    expect(res).toBe(false)
  })

  test('should reset values', async () => {
    await wsInstance.connect('metamask')
    expect(wsInstance.walletType).not.toBeNull()
    expect(wsInstance.account).toEqual(ACCOUNT_ADDRESS)
    expect(wsInstance.provider).not.toBeNull()
    wsInstance.resetValues()
    expect(wsInstance.walletType).toBeNull()
    expect(wsInstance.account).toEqual('')
    expect(wsInstance.provider).toBeUndefined()
  })

  describe('MetaMask', () => {
    afterAll(() => {
      wsInstance.disconnect()
      jest.clearAllMocks()
    })

    test('should set provider, account, walletType correctly', async () => {
      await wsInstance.connect('metamask')
      expect(window.ethereum.request).toHaveBeenCalled()
      expect(providers.Web3Provider).toHaveBeenCalledWith(
        window.ethereum,
        'any'
      )
      expect(wsInstance.account).toEqual(ACCOUNT_ADDRESS)
      expect(wsInstance.walletType).toEqual('metamask')
    })

    test('should return false on error connect/disconnect metamask', async () => {
      ;(global as any).window.ethereum = null
      const connectRes = await wsInstance.connectToMetaMask()
      expect(connectRes).toBe(false)
      expect(wsInstance.networkId).toEqual('56')

      const disconnectRes = await wsInstance.disconnectMetaMask()
      expect(disconnectRes).toBe(false)
    })

    test('should invoke disconnect metamask', async () => {
      await wsInstance.disconnectMetaMask()
      expect(window.ethereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }],
      })
    })

    test('should listen to MetaMask events like accountsChanged, chainChanged', async () => {
      // setting up mocks store, and spy on window.
      wsInstance.bindProviderListeners()
      expect(window.ethereum.on).toHaveBeenCalledWith(
        'accountsChanged',
        expect.any(Function)
      )
      expect(window.ethereum.on).toHaveBeenCalledWith(
        'chainChanged',
        expect.any(Function)
      )
      // trigger the event listner
      // the function binded to 'accountsChanged' listener
      const accountChangedCallback = window.ethereum.on.mock.calls[0][1]
      accountChangedCallback()

      expect(mockReload).toHaveBeenCalled()
      expect(store.dispatch).toHaveBeenCalledTimes(2)
      // trigger second event listner
      // the function binded to 'chainChanged' listener
      const chainChangedCallback = window.ethereum.on.mock.calls[1][1]
      chainChangedCallback('1') // valid chain id
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: true,
        type: 'SETUP/USER_TRIGGERED_CHAIN_SWITCH/SET',
      })

      expect(wsInstance.userTriggeredSwitchChain).not.toBeTruthy()

      // simulates change in network by metamask
      chainChangedCallback('56') // valid chain id
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: 56,
        type: 'SETUP/CHAINIDCHANGED/SET',
      })
      //const dispatchCalls = store.dispatch.calls

      // this should not trigger another dispatch call
      chainChangedCallback('56')
      //expect(dispatchCalls).toEqual(store.dispatch.calls)

      expect(wsInstance.userTriggeredSwitchChain).toEqual(false)
      chainChangedCallback('10') // invalid chain id
      expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function))
    })
  })

  describe('Wallet Connect', () => {
    beforeEach(() => {
      ;(EthereumProvider.init as jest.MockedFunction<any>).mockResolvedValue({
        on: mockOn,
        connect: mockConnect,
        enable: mockEnable,
        disconnect: mockDisconnect,
      })
    })

    test('should set provider, account, walletType correctly', async () => {
      await wsInstance.connect('walletconnect')
      expect(EthereumProvider.init).toHaveBeenCalled()
      expect(wsInstance.account).toEqual(ACCOUNT_ADDRESS)
      expect(wsInstance.walletType).toEqual('walletconnect')
    })

    test('should return false on error connect/disconnect walletConnect', async () => {
      //@ts-ignore
      providers.Web3Provider.mockImplementation(() => {
        throw new Error('throw error!')
      })

      const connectRes = await wsInstance.connectWalletConnect()
      expect(connectRes).toBe(false)

      mockDisconnect.mockImplementation(() => {
        throw new Error('throw error!')
      })
      const disconnectRes = await wsInstance.disconnectWalletConnect()
      expect(disconnectRes).toBe(false)
    })

    test('should invoke disconnect wallet', async () => {
      await wsInstance.disconnectWalletConnect()
      expect(mockDisconnect).toHaveBeenCalled()
    })

    test('should listen to walletConnect events like accountsChanged, chainChanged', async () => {
      // @ts-ignore
      utils.getAddress.mockImplementation((p: string) => p)
      await wsInstance.connect('walletconnect')
      wsInstance.bindProviderListeners()
      expect(mockOn).toHaveBeenCalledWith(
        'accountsChanged',
        expect.any(Function)
      )

      const accountChangeCallback = mockOn.mock.calls[0][1]
      accountChangeCallback([`${ACCOUNT_ADDRESS}1`])
      expect(window.location.reload).toHaveBeenCalled()

      const disconnectWalletCallback = mockOn.mock.calls[1][1]
      disconnectWalletCallback(5)
      expect(store.dispatch).toHaveBeenCalled()

      const chainChangedCallback = mockOn.mock.calls[2][1]
      chainChangedCallback(5)
      expect(store.dispatch).toHaveBeenCalledWith({
        payload: 5,
        type: 'SETUP/CHAINIDCHANGED/SET',
      })
    })
  })
})
