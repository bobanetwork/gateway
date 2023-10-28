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
  })
})
