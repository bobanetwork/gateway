import { LiquidityPoolLayer } from 'types/earn.types'
import earnService from './earn.service'
import { BigNumber, ethers, utils } from 'ethers'
import networkService from './networkService'
import walletService from './wallet.service'

jest.mock('./networkService')

const mockGas = BigNumber.from(50000)

jest.mock('./wallet.service', () => {
  return {
    provider: {
      getSigner: jest.fn(),
      getBlock: jest.fn(),
    },
  }
})

const mockWithdrawReward = jest.fn()
const mockWithdrawLiquidity = jest.fn()
const mockWait = jest.fn()

jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers')
  return {
    ...originalModule,
    ethers: {
      ...originalModule.ethers,
      Contract: jest.fn(() => ({
        estimateGas: {
          withdrawLiquidity: jest.fn(() => mockGas),
        },
        connect: jest.fn(() => ({
          withdrawLiquidity: jest.fn(),
        })),
        wait: jest.fn(),
      })),
      Wallet: jest.fn(),
    },
  }
})

describe('Earn Service', () => {
  // describe('getL1LPInfo ', () => {

  // })

  // describe('getL2LPInfo ', () => {

  // })

  describe('withdrawReward ', () => {
    beforeEach(() => {
      ;(ethers.Contract as any).mockImplementation(() => ({
        connect: jest.fn(() => ({
          withdrawReward: mockWithdrawReward.mockResolvedValue({
            wait: jest.fn(),
          }),
        })),
      }))
      networkService.account = 'mockedAccount'
    })

    it('should withdraw reward from L1LP successfully', async () => {
      const currencyAddress = '0x123'
      const valueWeiString = '1000'
      const L1orL2Pool = LiquidityPoolLayer.L1LP
      const result = await earnService.withdrawReward(
        currencyAddress,
        valueWeiString,
        L1orL2Pool
      )
      expect(result).toBeDefined()
      expect(ethers.Contract).toHaveBeenCalled()
      expect(mockWithdrawReward).toHaveBeenCalledWith(
        valueWeiString,
        currencyAddress,
        'mockedAccount'
      )
    })

    it('should withdraw reward from L2LP successfully', async () => {
      const currencyAddress = '0x456'
      const valueWeiString = '2000'
      const L1orL2Pool = LiquidityPoolLayer.L2LP
      const result = await earnService.withdrawReward(
        currencyAddress,
        valueWeiString,
        L1orL2Pool
      )
      expect(result).toBeDefined()
      expect(ethers.Contract).toHaveBeenCalled()
    })

    it('should handle withdrawal error', async () => {
      const currencyAddress = '0x789'
      const valueWeiString = '3000'
      const L1orL2Pool = LiquidityPoolLayer.L1LP

      const expectedError = new Error('Withdrawal failed')
      ;(ethers.Contract as any).mockImplementationOnce(() => ({
        connect: jest.fn(() => ({
          withdrawReward: jest.fn(() => {
            throw expectedError
          }),
        })),
      }))

      const result = await earnService.withdrawReward(
        currencyAddress,
        valueWeiString,
        L1orL2Pool
      )

      expect(result).toBe(expectedError)
    })
  })

  // describe('getL1LPBalance ', () => {

  // })

  // describe('getL2LPBalance ', () => {

  // })

  describe('withdrawLiquidity ', () => {
    beforeEach(() => {
      ;(ethers.Contract as any).mockImplementation(() => ({
        estimateGas: {
          withdrawLiquidity: mockWithdrawLiquidity.mockResolvedValue(mockGas),
        },
        connect: jest.fn(() => ({
          withdrawLiquidity: mockWithdrawLiquidity.mockResolvedValue({
            wait: mockWait,
          }),
        })),
      }))
      ;(walletService.provider?.getBlock as jest.Mock).mockResolvedValue({
        gasLimit: mockGas,
      })

      networkService.account = 'mockedAccount'
      walletService.account = 'mockedAccount'
    })
    it('should withdraw liquidity successfully for L1LP', async () => {
      const currency = 'ETH'
      const valueWeiString = utils.parseEther('1').toString()
      const L1orL2Pool = LiquidityPoolLayer.L1LP

      const result = await earnService.withdrawLiquidity(
        currency,
        valueWeiString,
        L1orL2Pool
      )

      expect(result).toBeDefined()
      expect(walletService.provider?.getBlock).toHaveBeenCalledWith('latest')
      expect(mockWithdrawLiquidity).toHaveBeenCalledTimes(2)
      expect(mockWithdrawLiquidity).toHaveBeenLastCalledWith(
        valueWeiString,
        currency,
        'mockedAccount',
        { gasLimit: mockGas }
      )
      expect(mockWait).toHaveBeenCalled()
    })

    it('should withdraw liquidity successfully for L2LP', async () => {
      const currency = 'BOBA'
      const valueWeiString = utils.parseEther('1').toString()
      const L1orL2Pool = LiquidityPoolLayer.L2LP

      const result = await earnService.withdrawLiquidity(
        currency,
        valueWeiString,
        L1orL2Pool
      )

      expect(result).toBeDefined()
      expect(walletService.provider?.getBlock).toHaveBeenCalledWith('latest')
      expect(mockWithdrawLiquidity).toHaveBeenCalledTimes(2)
      expect(mockWithdrawLiquidity).toHaveBeenLastCalledWith(
        valueWeiString,
        currency,
        'mockedAccount',
        { gasLimit: mockGas }
      )
      expect(mockWait).toHaveBeenCalled()
    })

    it('should handle error during withdrawal', async () => {
      const currency = 'ETH'
      const valueWeiString = utils.parseEther('1').toString()
      const L1orL2Pool = LiquidityPoolLayer.L1LP

      ;(ethers.Contract as any).mockImplementation(() => ({
        estimateGas: {
          withdrawLiquidity: mockWithdrawLiquidity.mockRejectedValueOnce(
            new Error('Withdrawal error')
          ),
        },
        connect: jest.fn(() => ({
          withdrawLiquidity: mockWithdrawLiquidity.mockRejectedValueOnce(
            new Error('Withdrawal error')
          ),
        })),
      }))

      const result = await earnService.withdrawLiquidity(
        currency,
        valueWeiString,
        L1orL2Pool
      )

      expect(result).toBeInstanceOf(Error)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
})
