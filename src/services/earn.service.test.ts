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

const mockRowTokens = [
  {
    tokenAddress: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
    tokenBalance: '99954534947000000000000',
    tokenSymbol: 'BOBA',
    tokenName: 'Boba Token',
    poolTokenInfo: {
      userDepositAmount: '100003300000000000000000',
      startTime: '1668555540',
      l1TokenAddress: '0xeCCD355862591CBB4bB7E7dD55072070ee3d0fC1',
      l2TokenAddress: '0x4200000000000000000000000000000000000023',
      accUserReward: '000000000000',
      accUserRewardPerShare: '3595007',
    },
    userTokenInfo: {
      amount: '0',
      pendingReward: '0',
      rewardDebt: '0',
    },
    decimals: 18,
  },
]

const mockProcessLpInfo = {
  poolInfo: {
    '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1': {
      symbol: 'BOBA',
      name: 'Boba Token',
      decimals: 18,
      l1TokenAddress: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
      l2TokenAddress: '0x4200000000000000000000000000000000000023',
      APR: 0,
      accUserReward: '000000000000',
      accUserRewardPerShare: '3595007',
      userDepositAmount: '100003300000000000000000',
      startTime: '1668555540',
      tokenBalance: '99954534947000000000000',
    },
  },
  userInfo: {
    '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1': {
      l2TokenAddress: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
      l1TokenAddress: '0xeccd355862591cbb4bb7e7dd55072070ee3d0fc1',
      amount: '0',
      pendingReward: '0',
      rewardDebt: '0',
    },
  },
}

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

  describe('preparePoolUserInfo ', () => {
    it('Should return the correct poolInfo, userInfo for provided rawTokens', () => {
      const res = earnService.preparePoolUserInfo(mockRowTokens)
      expect(res).toEqual(mockProcessLpInfo)
    })
  })

  describe('getTokenAddressList', () => {
    it('should return an empty array when networkService.tokenAddresses is undefined', () => {
      networkService.tokenAddresses = undefined
      const result = earnService.getTokenAddressList()
      expect(result).toEqual([])
    })

    it('should return an empty array when networkService.tokenAddresses is an empty object', () => {
      networkService.tokenAddresses = {}
      const result = earnService.getTokenAddressList()
      expect(result).toEqual([])
    })

    it('should return the correct token address list', () => {
      networkService.addresses.L1_ETH_Address = 'L1ETHADDRESS'
      networkService.addresses['TK_L2NativeTokenSymbol'] = 'L2ETHADDRESS'
      networkService.L1NativeTokenSymbol = 'NativeTokenSymbol'
      networkService.tokenAddresses = {
        xBOBA: { L1: 'L1xBOBA', L2: 'L2xBOBA' },
        WAGMIv1: { L1: 'L1WAGMIv1', L2: 'L2WAGMIv1' },
        BOBA: { L1: 'L1BOBA', L2: 'L2BOBA' },
        ETH: { L1: 'L1ETH', L2: 'L2ETH' },
      }
      const result = earnService.getTokenAddressList()
      expect(result).toEqual([
        { L1: 'l1boba', L2: 'l2boba' },
        { L1: 'l1eth', L2: 'l2eth' },
        { L1: 'L1ETHADDRESS', L2: 'L2ETHADDRESS' },
      ])
    })
  })

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
