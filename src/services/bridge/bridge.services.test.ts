import networkService from '../networkService'
import { bridgeService, BridgeService } from './bridge.services'

jest.mock('ethers', () => {
  return {
    Contract: jest.fn().mockResolvedValue(() => {
      return {
        connect: jest.fn().mockReturnThis(),
        depositTransaction: jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue('txResponse'),
        }),
      }
    }),
  }
})

jest.mock('../networkService', () => ({
  account: 'mockAccount',
  addresses: {
    OptimismPortalProxy: 'mockOptimismPortalProxy',
  },
  provider: {
    getSigner: jest.fn().mockReturnValue({
      sendTransaction: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue('txResponse'),
      }),
    }),
  },
  L1Provider: 'mockL1Provider',
}))

describe('BridgeService', () => {
  test('should create an instance of BridgeService', () => {
    expect(bridgeService).toBeInstanceOf(BridgeService)
  })

  describe('anchorageDepositNative', () => {
    beforeEach(() => {
      networkService.account = 'mockAccount'
      networkService.addresses.OptimismPortalProxy = 'mockOptimismPortalProxy'
      // @ts-ignore
      networkService.provider.getSigner = jest.fn().mockReturnValue({
        sendTransaction: jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue('txResponse'),
        }),
      })
    })

    test('anchorageDepositNative should throw error if wallet not connected', async () => {
      networkService.account = undefined
      await expect(
        bridgeService.anchorageDepositNative({
          recipient: '0xRecipient',
          amount: '1000',
        })
      ).resolves.toThrow('GATEWAY ERROR: wallet not connected')
    })

    test('anchorageDepositNative should throw error if Optimism portal address not provided', async () => {
      networkService.addresses.OptimismPortalProxy = null
      await expect(
        bridgeService.anchorageDepositNative({
          recipient: '0xRecipient',
          amount: '1000',
        })
      ).resolves.toThrow('GATEWAY ERROR: invalid optimism portal address')
    })

    xtest('anchorageDepositNative should call depositTransaction if recipient is provided', async () => {
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xRecipient',
        amount: '1000',
      })
      expect(result).toBe('txResponse')
    })

    test('anchorageDepositNative should call sendTransaction if recipient is not provided', async () => {
      const result = await bridgeService.anchorageDepositNative({
        recipient: '',
        amount: '1000',
      })
      expect(result).toBe('txResponse')
    })

    test('anchorageDepositNative should handle errors and return error object', async () => {
      // @ts-ignore
      networkService.provider.getSigner = jest.fn().mockImplementation(() => {
        throw new Error('Mock error')
      })
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xRecipient',
        amount: '1000',
      })
      expect(result).toEqual(new Error('Mock error'))
    })
  })
})
