import { LiquidityPoolLayer } from 'types/earn.types'
import earnService from './earn.service'
import { ethers } from 'ethers'
import networkService from './networkService'

jest.mock('./networkService')

jest.mock('./wallet.service', () => {
  return {
    provider: {
      getSigner: jest.fn(),
    },
  }
})
const mockWithdrawReward = jest.fn()
jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers')
  return {
    ...originalModule,
    ethers: {
      ...originalModule.ethers,
      Contract: jest.fn(),
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

  // describe('withdrawLiquidity ', () => {

  // })
})
