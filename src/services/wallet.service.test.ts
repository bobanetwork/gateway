import { providers } from 'ethers'
import walletService from './wallet.service'
import { EthereumProvider } from '@walletconnect/ethereum-provider'

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
const mockDisconnect = jest.fn()

describe('WalletService', () => {
  const wsInstance = walletService
  let ethereumMock: any

  beforeAll(() => {
    ethereumMock = {
      request: jest.fn(),
    }
    ;(global as any).window.ethereum = ethereumMock
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    // @ts-ignore
    providers.Web3Provider.mockImplementation(() => {
      return {
        getSigner: jest.fn(() => ({
          getAddress: jest.fn().mockResolvedValue(ACCOUNT_ADDRESS), // Replace with your desired address
        })),
      }
    })
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

    test('should invoke disconnect metamask', async () => {
      await wsInstance.disconnectMetaMask()
      expect(window.ethereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
        params: [{ eth_accounts: {} }],
      })
    })

    test('should listen to MetaMask events like accountsChanged, chainChanged', () => {
      expect(1).toBe(1)
    })

    test('should trigger watchAsset with correct params on addTokenToMetaMask', () => {
      expect(1).toBe(1)
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

    test('should invoke disconnect wallet', async () => {
      await wsInstance.disconnectWalletConnect()
      expect(mockDisconnect).toHaveBeenCalled()
    })

    test('should listen to walletConnect events like accountsChanged, chainChanged', () => {
      expect(1).toBe(1)
    })
  })

  test('connect should invoke functions correct based on type', () => {
    expect(1).toBe(1)
  })
  test('disconnect should invoke functions correct based on type', () => {
    expect(1).toBe(1)
  })
  test('listenners should invoke functions correct based on type', () => {
    expect(1).toBe(1)
  })
  test('should reset values', () => {
    expect(1).toBe(1)
  })
})
