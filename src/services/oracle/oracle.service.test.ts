import { Contract, providers } from 'ethers'
import oracleService from './oracle.service'
import networkService from 'services/networkService'
import { addBobaFee } from 'actions/setupAction'
import { Network } from 'util/network/network.util'

jest.mock('../../actions/setupAction', () => ({
  addBobaFee: jest.fn(),
}))

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
    },
  }
})

jest.mock('../networkService')

describe('OracleService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })
  })

  describe('getBobaFeeChoice', () => {
    let bobaFeeContractMock: any
    let getSignerMock: any
    beforeEach(() => {
      getSignerMock = jest.fn().mockReturnValue({})
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })
      bobaFeeContractMock = {
        priceRatio: jest.fn().mockResolvedValue(20),
        bobaFeeTokenUsers: jest.fn().mockResolvedValue(true),
        secondaryFeeTokenUsers: jest.fn().mockResolvedValue(true),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(bobaFeeContractMock)
      ;(addBobaFee as unknown as jest.Mock).mockResolvedValue([])
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should throw error when not connected to wallet', async () => {
      ;(networkService as any).account = null

      const res = await oracleService.getBobaFeeChoice()
      expect(res).toBeInstanceOf(Error)
      expect((res as Error).message).toEqual(
        'GATEWAY ERROR: wallet not connected!'
      )
    })

    it('should throw error when not connected to L2', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L1'
      const res = await oracleService.getBobaFeeChoice()
      expect(res).toBeInstanceOf(Error)
      expect((res as Error).message).toEqual(
        'GATEWAY ERROR: invalid oracle address!'
      )
    })

    it('should invoke bobaFeeTokenUsers when network is ETHEREUM', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).networkGateway = Network.ETHEREUM
      ;(networkService as any).addresses = { Boba_GasPriceOracle: '0xOracle' }
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const res = await oracleService.getBobaFeeChoice()
      expect(bobaFeeContractMock.priceRatio).toHaveBeenCalled()
      expect(bobaFeeContractMock.bobaFeeTokenUsers).toHaveBeenCalled()
      expect(addBobaFee).toHaveBeenCalledWith({
        feeChoice: true,
        priceRatio: '20',
      })
      expect(res).toEqual({
        feeChoice: true,
        priceRatio: '20',
      })
    })

    it('should invoke secondaryFeeTokenUsers when network is not ETHEREUM', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).networkGateway = Network.BNB
      ;(networkService as any).addresses = { Boba_GasPriceOracle: '0xOracle' }
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const res = await oracleService.getBobaFeeChoice()
      expect(bobaFeeContractMock.priceRatio).toHaveBeenCalled()
      expect(bobaFeeContractMock.secondaryFeeTokenUsers).toHaveBeenCalled()
      expect(addBobaFee).toHaveBeenCalledWith({
        feeChoice: false,
        priceRatio: '20',
      })
      expect(res).toEqual({
        feeChoice: false,
        priceRatio: '20',
      })
    })
  })

  describe('switchFeeToken >', () => {
    let bobaFeeContractMock: any
    let getSignerMock: any

    beforeEach(() => {
      // jest.spyOn(console, 'log').mockImplementation(() => { })
      getSignerMock = jest.fn().mockReturnValue({})
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })
      bobaFeeContractMock = {
        useBobaAsFeeToken: jest.fn().mockResolvedValue({ wait: jest.fn() }),
        useETHAsFeeToken: jest.fn().mockResolvedValue({ wait: jest.fn() }),
        useSecondaryFeeTokenAsFeeToken: jest
          .fn()
          .mockResolvedValue({ wait: jest.fn() }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(bobaFeeContractMock)
      jest.spyOn(oracleService, 'getBobaFeeChoice').mockResolvedValue(undefined)
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should throw error when not connected to wallet', async () => {
      ;(networkService as any).account = null

      const res = await oracleService.switchFeeToken('BOBA')
      expect(res).toBeInstanceOf(Error)
      expect((res as Error).message).toEqual(
        'GATEWAY ERROR: wallet not connected!'
      )
    })

    it('should throw error when not connected to L2', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L1'
      const res = await oracleService.switchFeeToken('BOBA')
      expect(res).toBeInstanceOf(Error)
      expect((res as Error).message).toEqual(
        'GATEWAY ERROR: on L1 network switch to L2 network!'
      )
    })
    it('should throw error boba gas price oracle contract address is invalid', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).addresses = { Boba_GasPriceOracle: null }
      const res = await oracleService.switchFeeToken('BOBA')
      expect(res).toBeInstanceOf(Error)
      expect((res as Error).message).toEqual(
        'GATEWAY ERROR: invalid oracle address!'
      )
    })
    it('should invoke useBobaAsFeeToken when target fee is BOBA', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).addresses = { Boba_GasPriceOracle: '0xOracle' }
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
      const txMock = { wait: jest.fn() }
      bobaFeeContractMock.useBobaAsFeeToken.mockResolvedValue(txMock)

      const result = await oracleService.switchFeeToken('BOBA')

      expect(bobaFeeContractMock.useBobaAsFeeToken).toHaveBeenCalled()
      expect(txMock.wait).toHaveBeenCalled()
      expect(result).toBe(txMock)
    })
    it('should invoke useETHAsFeeToken when target fee is ETH', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).addresses = { Boba_GasPriceOracle: '0xOracle' }
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
      const txMock = { wait: jest.fn() }
      bobaFeeContractMock.useETHAsFeeToken.mockResolvedValue(txMock)

      const result = await oracleService.switchFeeToken('ETH')

      expect(bobaFeeContractMock.useETHAsFeeToken).toHaveBeenCalled()
      expect(txMock.wait).toHaveBeenCalled()
      expect(result).toBe(txMock)
    })
    it('should invoke useSecondaryFeeTokenAsFeeToken when target fee is L1NativeToken', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).addresses = { Boba_GasPriceOracle: '0xOracle' }
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
      ;(networkService as any).L1NativeTokenSymbol = 'SECONDARY'

      const txMock = { wait: jest.fn() }
      bobaFeeContractMock.useSecondaryFeeTokenAsFeeToken.mockResolvedValue(
        txMock
      )

      const result = await oracleService.switchFeeToken('SECONDARY')

      expect(
        bobaFeeContractMock.useSecondaryFeeTokenAsFeeToken
      ).toHaveBeenCalled()
      expect(txMock.wait).toHaveBeenCalled()
      expect(result).toBe(txMock)
    })
    it('should return false when target is fee invalid token', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).addresses = { Boba_GasPriceOracle: '0xOracle' }
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
      const result = await oracleService.switchFeeToken('INVALID_TOKEN')
      expect(result).toBe(false)
    })
    it('should return error if transaction fails', async () => {
      ;(networkService as any).account = '0x123'
      ;(networkService as any).L1orL2 = 'L2'
      ;(networkService as any).addresses = { Boba_GasPriceOracle: '0xOracle' }
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const error = new Error('Transaction error')

      bobaFeeContractMock.useBobaAsFeeToken.mockRejectedValue(error)

      const result = await oracleService.switchFeeToken('BOBA')
      expect(result).toBe(error)
    })
  })

  describe('getLatestL2OutputBlockNumber >', () => {
    let l2OutputOracleContractMockMock: any
    let getSignerMock: any
    let latestBlockNumberMock: any

    beforeEach(() => {
      // jest.spyOn(console, 'log').mockImplementation(() => { })
      getSignerMock = jest.fn().mockReturnValue({})
      latestBlockNumberMock = jest.fn().mockReturnValue(12345)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })
      ;(networkService as any).L1Provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      l2OutputOracleContractMockMock = {
        latestBlockNumber: latestBlockNumberMock,
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(
        l2OutputOracleContractMockMock
      )
      jest.spyOn(oracleService, 'getBobaFeeChoice').mockResolvedValue(undefined)
    })

    it('Should throw error and return ZERO in case contract address in not found', async () => {
      networkService.addresses.L2OutputOracleProxy = undefined
      const result = await oracleService.getLatestL2OutputBlockNumber()
      expect(result).toBe(0)
    })

    it('Should return correct block', async () => {
      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      const result = await oracleService.getLatestL2OutputBlockNumber()
      expect(result).toBe(12345)
    })
  })
})
