import networkService from 'services/networkService'
import { bridgeService } from './bridge.services'
import { ERROR_CODE } from 'util/constant'
import { BigNumber, Contract, providers } from 'ethers'

jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers')
  return {
    __esModule: true,
    ...originalModule,
    Contract: jest.fn(),
    providers: {
      JsonRpcProvider: jest.fn().mockReturnValue({
        getSigner: jest.fn(),
      }),
      StaticJsonRpcProvider: jest.fn().mockReturnValue({
        getSigner: jest.fn(),
      }),
    },
  }
})

describe('BridgeService', () => {
  let contractMock: any
  let getSignerMock: any
  let depositTransactionMock: any
  let depositERC20TransactionMock: any
  let sendTransactionMock: any
  let balanceOfMock: any
  let depositTransactionWait: any
  let depositERC20TransactionWait: any
  let sendTransactionWait: any
  let depositERC20Wait: any
  let depositERC20Mock: any
  beforeEach(() => {
    networkService.account = '0xAccount'
    networkService.addresses.OptimismPortalProxy = '0xOP'
    networkService.addresses.L1StandardBridgeProxy = '0xL1SB'
    networkService.tokenAddresses = {
      BOBA: {
        L1: 'L1_TOKEN',
        L2: 'L2_TOKEN',
      },
    }

    depositTransactionWait = jest.fn().mockReturnValue(true)
    sendTransactionWait = jest.fn().mockReturnValue('done')
    depositERC20TransactionWait = jest.fn().mockReturnValue('done')
    depositERC20Wait = jest.fn().mockReturnValue('done')
    depositERC20Mock = jest.fn().mockReturnValue({ wait: depositERC20Wait })
    depositTransactionMock = jest
      .fn()
      .mockReturnValue({ wait: depositTransactionWait })
    sendTransactionMock = jest
      .fn()
      .mockReturnValue({ wait: sendTransactionWait })
    depositERC20TransactionMock = jest
      .fn()
      .mockReturnValue({ wait: depositERC20TransactionWait })
    balanceOfMock = jest.fn().mockReturnValue(BigNumber.from(3))

    getSignerMock = jest.fn().mockReturnValue({
      sendTransaction: sendTransactionMock,
    })
    ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
      getSigner: getSignerMock,
    })

    networkService.provider = new providers.JsonRpcProvider('http://demo.local')

    contractMock = {
      attach: jest.fn().mockReturnValue({
        balanceOf: balanceOfMock,
        allowance: jest.fn().mockReturnValue(BigNumber.from('5')),
      }),
      connect: jest.fn().mockReturnValue({
        depositTransaction: depositTransactionMock,
        depositERC20Transaction: depositERC20TransactionMock,
        depositERC20: depositERC20Mock,
        depositERC20To: depositERC20Mock,
      }),
    }
    ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
  })

  describe('anchorageDepositNative', () => {
    it('should invoke deposittransaction incase of recipient', async () => {
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(depositTransactionMock).toHaveBeenCalled()
      expect(depositTransactionMock).toHaveBeenCalledWith(
        '0xrecipient',
        0,
        100000,
        false,
        [],
        { value: '2' }
      )
      expect(depositTransactionWait).toHaveBeenCalled()
      expect(result).toBe(true)
    })
    it('should invoke sendTransaction incase of no recipient', async () => {
      const result = await bridgeService.anchorageDepositNative({
        amount: '2',
      })
      expect(sendTransactionMock).toHaveBeenCalled()
      expect(sendTransactionMock).toHaveBeenCalledWith({
        to: undefined,
        value: '2',
      })
      expect(sendTransactionWait).toHaveBeenCalled()
      expect(result).toBe('done')
    })

    it('should throw error incase the wallet not connected!', async () => {
      networkService.account = undefined
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} wallet not connected!`))
    })

    it('should throw error incase of invalid optimism portal address!', async () => {
      networkService.addresses.OptimismPortalProxy = undefined
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} invalid optimism portal address`)
      )
    })

    it('should throw error incase of invalid optimism portal address!', async () => {
      getSignerMock.mockReturnValue(null)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })

      networkService.provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} no signer found`))
    })
  })
  describe('anchorageDepositERC20', () => {
    it('should invoke anchorageDepositERC20 when token allowed to bridge to self', async () => {
      const result = await bridgeService.anchorageDepositERC20({
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcl2',
      })
      expect(depositERC20Mock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalledWith(
        '0xc',
        '0xcl2',
        '2',
        999999,
        '0x'
      )
      expect(depositERC20Wait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should invoke anchorageDepositERC20 with recipient address when token allowed to bridge to recipient', async () => {
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcl2',
      })
      expect(depositERC20Mock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalledWith(
        '0xc',
        '0xcl2',
        'recipient',
        '2',
        999999,
        '0x'
      )
      expect(depositERC20Wait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should invoke approve and depositERC20Transaction when token is not allowed to bridge to recipient', async () => {
      const approveMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      contractMock = {
        attach: jest.fn().mockReturnValue({
          balanceOf: balanceOfMock,
          allowance: jest.fn().mockReturnValue(BigNumber.from('1')),
          connect: jest.fn().mockReturnValue({
            approve: approveMock,
          }),
        }),
        connect: jest.fn().mockReturnValue({
          depositERC20: depositERC20Mock,
          depositERC20To: depositERC20Mock,
        }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xc',
      })
      expect(approveMock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalledWith(
        '0xc',
        '0xc',
        'recipient',
        '2',
        999999,
        '0x'
      )
      expect(depositERC20Wait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should throw error incase the wallet not connected!', async () => {
      networkService.account = undefined
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcL2',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} wallet not connected!`))
    })

    it('should throw error incase the L1StandardBridgeProxy is invalid!', async () => {
      networkService.addresses.L1StandardBridgeProxy = undefined
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcL2',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} invalid L1StandardBridge address`)
      )
    })

    it('should throw error incase of no signer found!', async () => {
      getSignerMock.mockReturnValue(null)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })

      networkService.provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const result = await bridgeService.anchorageDepositERC20({
        recipient: '0xrecipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xc',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} no signer found!`))
    })

    it('should throw error in case of insufficient L1 token balance', async () => {
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '4',
        currency: '0xc',
        currencyL2: '0xcL2',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} insufficient L1 token balance`)
      )
    })
  })
  describe('anchorageDepositERC20Optimism', () => {
    it('should invoke depositERC20Transaction when token allowed to bridge to self', async () => {
      const result = await bridgeService.anchorageDepositERC20Optimism({
        amount: '2',
        currency: '0xc',
      })
      expect(depositERC20TransactionWait).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalledWith(
        '0xAccount',
        '2',
        0,
        100000,
        false,
        []
      )
      expect(result).toEqual('done')
    })

    it('should invoke depositERC20Transaction when token allowed to bridge to recipient', async () => {
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
      })
      expect(depositERC20TransactionWait).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalledWith(
        'recipient',
        0,
        '2',
        100000,
        false,
        []
      )
      expect(result).toEqual('done')
    })
    it('should invoke approve and depositERC20Transaction when token is not allowed to bridge to recipient', async () => {
      const approveMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      contractMock = {
        attach: jest.fn().mockReturnValue({
          balanceOf: balanceOfMock,
          allowance: jest.fn().mockReturnValue(BigNumber.from('1')),
          connect: jest.fn().mockReturnValue({
            approve: approveMock,
          }),
        }),
        connect: jest.fn().mockReturnValue({
          depositTransaction: depositTransactionMock,
          depositERC20Transaction: depositERC20TransactionMock,
        }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
      })
      expect(approveMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalledWith(
        'recipient',
        0,
        '2',
        100000,
        false,
        []
      )
      expect(depositERC20TransactionWait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should throw error in case of insufficient L1 token balance', async () => {
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '4',
        currency: '0xc',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} insufficient L1 token balance`)
      )
    })

    it('should throw error incase the wallet not connected!', async () => {
      networkService.account = undefined
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} wallet not connected!`))
    })

    it('should throw error incase of invalid optimism portal address!', async () => {
      networkService.addresses.OptimismPortalProxy = undefined
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: '0xrecipient',
        amount: '2',
        currency: '0xc',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} invalid optimismPortalProxy address`)
      )
    })

    it('should throw error incase of no signer found!', async () => {
      getSignerMock.mockReturnValue(null)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })

      networkService.provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: '0xrecipient',
        amount: '2',
        currency: '0xc',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} no signer found`))
    })
  })
})
