import { LiquidityPoolLayer } from 'types/earn.types'
import earnService from './earn.service'
import { BigNumber, Contract, ethers, utils } from 'ethers'
import networkService from './networkService'
import walletService from './wallet.service'
import { Network } from 'util/network/network.util'

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
  describe('getL1LPInfo ', () => {
    afterAll(() => {
      jest.restoreAllMocks()
    })
    test('should return empty object when the token is empty or error thrown', async () => {
      jest.spyOn(earnService, 'getTokenAddressList').mockReturnValue([])
      const result = await earnService.getL1LPInfo()
      expect(result).toEqual({ poolInfo: {}, userInfo: {} })
      expect(earnService.getTokenAddressList).toHaveBeenCalled()

      jest.spyOn(earnService, 'getTokenAddressList').mockImplementation(() => {
        throw new Error('Mocked error')
      })
      const errorResult = await earnService.getL1LPInfo()
      expect(errorResult).toEqual({ poolInfo: {}, userInfo: {} })
      expect(earnService.getTokenAddressList).toHaveBeenCalled()
    })

    test('should invoke functions and return results correctly', async () => {
      // Arrange
      const mockTokenList = [
        {
          L1: '0x9876543210987654321098765432109876543210',
          L2: '0x9876543210987654321098765432109876543210',
        },
        {
          L1: '0x9876543210987654321098765432109876543210',
          L2: '0x9876543210987654321098765432109876543210',
        },
      ]

      jest
        .spyOn(earnService, 'getTokenAddressList')
        .mockReturnValue(mockTokenList)
      jest
        .spyOn(earnService, 'getL1TokenDetail')
        .mockImplementation(async (params) => ({
          tokenAddress: 'tokenAddress',
          tokenBalance: BigNumber.from(100),
          tokenSymbol: `${params.tokenAddress}Symbol`,
          tokenName: `${params.tokenAddress}Name`,
          decimals: 18,
        }))

      jest
        .spyOn(earnService, 'getPoolInfo')
        .mockImplementation(async ({ tokenAddress }) => ({
          userDepositAmount: '100',
          accUserReward: '0',
          accUserRewardPerShare: '0.5',
          startTime: '1638430800',
          l1TokenAddress: tokenAddress.toLowerCase(),
          l2TokenAddress: `L2${tokenAddress}Address`,
        }))
      jest
        .spyOn(earnService, 'getTokenInfo')
        .mockImplementation(async (params) => {
          if (params.tokenAddress === 'L1Token2') {
            throw new Error('Mocked error for L1Token2')
          }
          return {
            amount: '10',
            pendingReward: '5',
            rewardDebt: '0',
          }
        })

      // Act
      const result = await earnService.getL1LPInfo()

      // Assert
      expect(result).toEqual({
        poolInfo: {
          tokenaddress: {
            APR: 0,
            accUserReward: '0',
            accUserRewardPerShare: '0.5',
            decimals: 18,
            l1TokenAddress: '0x9876543210987654321098765432109876543210',
            l2TokenAddress:
              'l20x9876543210987654321098765432109876543210address',
            name: '0x9876543210987654321098765432109876543210Name',
            startTime: '1638430800',
            symbol: '0x9876543210987654321098765432109876543210Symbol',
            tokenBalance: '100',
            userDepositAmount: '100',
          },
        },
        userInfo: {
          tokenaddress: {
            amount: '10',
            l1TokenAddress: 'tokenaddress',
            l2TokenAddress: 'tokenaddress',
            pendingReward: '5',
            rewardDebt: '0',
          },
        },
      })

      expect(earnService.getTokenAddressList).toHaveBeenCalled()
      expect(earnService.getL1TokenDetail).toHaveBeenCalledTimes(2)
      expect(earnService.getPoolInfo).toHaveBeenCalledTimes(2)
      expect(earnService.getTokenInfo).toHaveBeenCalledTimes(2)
    })
  })
  describe('getL2LPInfo ', () => {
    afterAll(() => {
      jest.restoreAllMocks()
    })
    test('should return empty object when the token is empty or error thrown', async () => {
      jest.spyOn(earnService, 'getTokenAddressList').mockReturnValue([])

      const result = await earnService.getL2LPInfo()

      expect(result).toEqual({ poolInfo: {}, userInfo: {} })
      expect(earnService.getTokenAddressList).toHaveBeenCalled()

      jest.spyOn(earnService, 'getTokenAddressList').mockImplementation(() => {
        throw new Error('Mocked error')
      })
      const errorResult = await earnService.getL2LPInfo()
      expect(errorResult).toEqual({ poolInfo: {}, userInfo: {} })
      expect(earnService.getTokenAddressList).toHaveBeenCalled()
    })

    test('should invoke functions and return results correctly', async () => {
      // Arrange
      const mockTokenList = [
        {
          L1: '0x9876543210987654321098765432109876543210',
          L2: '0x9876543210987654321098765432109876543210',
        },
        {
          L1: '0x9876543210987654321098765432109876543210',
          L2: '0x9876543210987654321098765432109876543210',
        },
      ]

      jest
        .spyOn(earnService, 'getTokenAddressList')
        .mockReturnValue(mockTokenList)
      jest
        .spyOn(earnService, 'getL2TokenDetail')
        .mockImplementation(async (params) => ({
          tokenAddress: 'tokenAddress',
          tokenBalance: BigNumber.from(100),
          tokenSymbol: `${params.tokenAddress}Symbol`,
          tokenName: `${params.tokenAddress}Name`,
          decimals: 18,
        }))

      jest
        .spyOn(earnService, 'getPoolInfo')
        .mockImplementation(async ({ tokenAddress }) => ({
          userDepositAmount: '100',
          accUserReward: '0',
          accUserRewardPerShare: '0.5',
          startTime: '1638430800',
          l1TokenAddress: tokenAddress.toLowerCase(),
          l2TokenAddress: `L2${tokenAddress}Address`,
        }))
      jest
        .spyOn(earnService, 'getTokenInfo')
        .mockImplementation(async (params) => {
          if (params.tokenAddress === 'L1Token2') {
            throw new Error('Mocked error for L1Token2')
          }
          return {
            amount: '10',
            pendingReward: '5',
            rewardDebt: '0',
          }
        })

      // Act
      const result = await earnService.getL2LPInfo()

      // Assert
      expect(result).toEqual({
        poolInfo: {
          tokenaddress: {
            APR: 0,
            accUserReward: '0',
            accUserRewardPerShare: '0.5',
            decimals: 18,
            l1TokenAddress: '0x9876543210987654321098765432109876543210',
            l2TokenAddress:
              'l20x9876543210987654321098765432109876543210address',
            name: '0x9876543210987654321098765432109876543210Name',
            startTime: '1638430800',
            symbol: '0x9876543210987654321098765432109876543210Symbol',
            tokenBalance: '100',
            userDepositAmount: '100',
          },
        },
        userInfo: {
          tokenaddress: {
            amount: '10',
            l1TokenAddress: 'tokenaddress',
            l2TokenAddress: 'tokenaddress',
            pendingReward: '5',
            rewardDebt: '0',
          },
        },
      })

      expect(earnService.getTokenAddressList).toHaveBeenCalled()
      expect(earnService.getL2TokenDetail).toHaveBeenCalledTimes(2)
      expect(earnService.getPoolInfo).toHaveBeenCalledTimes(2)
      expect(earnService.getTokenInfo).toHaveBeenCalledTimes(2)
    })
  })

  describe('getL1TokenDetail', () => {
    let mockL1Provider: any
    const mockSymbol = jest.fn()
    const mockName = jest.fn()
    const mockDecimals = jest.fn()
    const mockBalanceOf = jest.fn()
    beforeEach(() => {
      mockL1Provider = {
        getBalance: jest.fn().mockResolvedValue(BigNumber.from(100)),
      }
      networkService.L1Provider = mockL1Provider
      networkService.L1_TEST_Contract = {
        attach: jest.fn(() => ({
          balanceOf: mockBalanceOf,
          symbol: mockSymbol,
          name: mockName,
          decimals: mockDecimals,
          connect: jest.fn(() => ({
            balanceOf: mockBalanceOf.mockResolvedValue(BigNumber.from(200)),
            symbol: mockSymbol.mockResolvedValue('Unknown'),
            name: mockName.mockResolvedValue('Unknown Token'),
            decimals: mockDecimals.mockResolvedValue(18),
          })),
        })),
      } as unknown as Contract
    })

    it('should return details for the native token (ETH)', async () => {
      const tokenAddress = networkService.addresses.L1_ETH_Address
      networkService.L1NativeTokenSymbol = 'ETH'
      networkService.L1NativeTokenName = 'Ethereum'

      const result = await earnService.getL1TokenDetail({ tokenAddress })

      expect(result).toEqual({
        tokenAddress,
        tokenBalance: BigNumber.from(100),
        tokenSymbol: 'ETH',
        tokenName: 'Ethereum',
        decimals: 18,
      })
      expect(networkService.L1Provider!.getBalance).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
    })

    it('should return details for an ERC-20 token', async () => {
      const tokenAddress = '0x1234567890123456789012345678901234567890'
      const tokenInfoFiltered = {
        symbol: 'ABC',
        name: 'ABC Token',
        decimals: 8,
      }
      networkService.tokenInfo = {
        L1: { [utils.getAddress(tokenAddress)]: tokenInfoFiltered },
        L2: { [utils.getAddress(tokenAddress)]: tokenInfoFiltered },
      }

      const result = await earnService.getL1TokenDetail({ tokenAddress })

      expect(result).toEqual({
        tokenAddress,
        tokenBalance: BigNumber.from(200),
        tokenSymbol: 'ABC',
        tokenName: 'ABC Token',
        decimals: 8,
      })
      expect(networkService.L1_TEST_Contract!.attach).toHaveBeenCalledWith(
        tokenAddress
      )
      expect(mockBalanceOf).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
    })

    it('should return default details for an unknown ERC-20 token', async () => {
      const tokenAddress = '0x9876543210987654321098765432109876543210'
      networkService.tokenInfo = {
        L1: {},
        L2: {},
      }

      const result = await earnService.getL1TokenDetail({ tokenAddress })

      expect(result).toEqual({
        tokenAddress,
        tokenBalance: BigNumber.from(200),
        tokenSymbol: 'Unknown',
        tokenName: 'Unknown Token',
        decimals: 18,
      })
      expect(networkService.L1_TEST_Contract!.attach).toHaveBeenCalledWith(
        tokenAddress
      )
      expect(mockBalanceOf).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
      expect(mockSymbol).toHaveBeenCalled()
      expect(mockName).toHaveBeenCalled()
      expect(mockDecimals).toHaveBeenCalled()
    })
  })

  describe('getL2TokenDetail', () => {
    let mockL2Provider: any
    const mockSymbol = jest.fn()
    const mockName = jest.fn()
    const mockDecimals = jest.fn()
    const mockBalanceOf = jest.fn()
    beforeEach(() => {
      mockL2Provider = {
        getBalance: jest.fn().mockResolvedValue(BigNumber.from(100)),
      }
      networkService.L2Provider = mockL2Provider
      networkService.L2_TEST_Contract = {
        attach: jest.fn(() => ({
          balanceOf: mockBalanceOf,
          symbol: mockSymbol,
          name: mockName,
          decimals: mockDecimals,
          connect: jest.fn(() => ({
            balanceOf: mockBalanceOf.mockResolvedValue(BigNumber.from(200)),
            symbol: mockSymbol.mockResolvedValue('Unknown'),
            name: mockName.mockResolvedValue('Unknown Token'),
            decimals: mockDecimals.mockResolvedValue(18),
          })),
        })),
      } as unknown as Contract
      networkService.L1_TEST_Contract = {
        attach: jest.fn(() => ({
          balanceOf: mockBalanceOf,
          symbol: mockSymbol,
          name: mockName,
          decimals: mockDecimals,
          connect: jest.fn(() => ({
            balanceOf: mockBalanceOf.mockResolvedValue(BigNumber.from(200)),
            symbol: mockSymbol.mockResolvedValue('Unknown'),
            name: mockName.mockResolvedValue('Unknown Token'),
            decimals: mockDecimals.mockResolvedValue(18),
          })),
        })),
      } as unknown as Contract
    })

    it('should return details for the native token (ETH)', async () => {
      const tokenAddress = networkService.addresses.L2_ETH_Address
      const tokenAddressL1 = networkService.addresses.L2_ETH_Address
      networkService.L1NativeTokenSymbol = 'ETH'
      networkService.L1NativeTokenName = 'Ethereum'

      const result = await earnService.getL2TokenDetail({
        tokenAddress,
        tokenAddressL1,
      })

      expect(result).toEqual({
        tokenAddress,
        tokenBalance: BigNumber.from(100),
        tokenSymbol: 'BOBA',
        tokenName: 'BOBA Token',
        decimals: 18,
      })
      expect(networkService.L2Provider!.getBalance).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )

      networkService.network = Network.ETHEREUM
      const resultEth = await earnService.getL2TokenDetail({
        tokenAddress,
        tokenAddressL1,
      })

      expect(resultEth).toEqual({
        tokenAddress,
        tokenBalance: BigNumber.from(100),
        tokenSymbol: 'ETH',
        tokenName: 'Ethereum',
        decimals: 18,
      })
    })

    it('should return details for an ERC-20 token', async () => {
      const tokenAddress = '0x1234567890123456789012345678901234567890'
      const tokenAddressL1 = '0x1234567890123456789012345678901234567890'
      const tokenInfoFiltered = {
        symbol: 'ABC',
        name: 'ABC Token',
        decimals: 8,
      }
      networkService.tokenInfo = {
        L1: { [utils.getAddress(tokenAddress)]: tokenInfoFiltered },
        L2: { [utils.getAddress(tokenAddress)]: tokenInfoFiltered },
      }

      const result = await earnService.getL2TokenDetail({
        tokenAddress,
        tokenAddressL1,
      })

      expect(result).toEqual({
        tokenAddress,
        tokenBalance: BigNumber.from(200),
        tokenSymbol: 'ABC',
        tokenName: 'ABC Token',
        decimals: 8,
      })
      expect(networkService.L2_TEST_Contract!.attach).toHaveBeenCalledWith(
        tokenAddress
      )
      expect(mockBalanceOf).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
    })

    it('should return default details for an unknown ERC-20 token', async () => {
      const tokenAddress = '0x9876543210987654321098765432109876543210'
      const tokenAddressL1 = '0x9876543210987654321098765432109876543210'
      networkService.tokenInfo = {
        L1: {},
        L2: {},
      }

      const result = await earnService.getL2TokenDetail({
        tokenAddress,
        tokenAddressL1,
      })

      expect(result).toEqual({
        tokenAddress,
        tokenBalance: BigNumber.from(200),
        tokenSymbol: 'Unknown',
        tokenName: 'Unknown Token',
        decimals: 18,
      })
      expect(networkService.L1_TEST_Contract!.attach).toHaveBeenCalledWith(
        tokenAddress
      )
      expect(mockBalanceOf).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
      expect(mockSymbol).toHaveBeenCalled()
      expect(mockName).toHaveBeenCalled()
      expect(mockDecimals).toHaveBeenCalled()
    })
  })

  describe('getPoolInfo', () => {
    it('should return poolInfo when lpContract.poolInfo succeeds', async () => {
      const tokenAddress = '0x123abc'
      const mockPoolInfo = mockRowTokens[0].poolTokenInfo
      const mockLpContract = {
        poolInfo: jest.fn().mockResolvedValue(mockPoolInfo),
      } as unknown as Contract

      const result = await earnService.getPoolInfo({
        tokenAddress,
        lpContract: mockLpContract,
      })
      expect(result).toEqual(mockPoolInfo)
      expect(mockLpContract.poolInfo).toHaveBeenCalledWith(tokenAddress)
    })

    it('should throw an error when lpContract.poolInfo fails', async () => {
      const tokenAddress = '0x456def'
      const error = new Error('Mock poolInfo error')
      const mockLpContract = {
        poolInfo: jest.fn().mockRejectedValue(error),
      } as unknown as Contract

      const result = await earnService.getPoolInfo({
        tokenAddress,
        lpContract: mockLpContract,
      })
      expect(result).toEqual({})
      expect(mockLpContract.poolInfo).toHaveBeenCalledWith(tokenAddress)
    })
  })

  describe('getTokenInfo', () => {
    it('should return userInfo when walletService.account is truthy', async () => {
      const tokenAddress = '0x123abc'
      const fakeUserInfo = { amount: '100', rewardDebt: '50' }
      walletService.account = '0x789def'
      const mockLpContract = {
        userInfo: jest.fn().mockResolvedValue(fakeUserInfo),
      } as unknown as Contract

      const result = await earnService.getTokenInfo({
        tokenAddress,
        lpContract: mockLpContract,
      })

      expect(result).toEqual(fakeUserInfo)
      expect(mockLpContract.userInfo).toHaveBeenCalledWith(
        tokenAddress,
        walletService.account
      )
    })

    it('should return an empty object when walletService.account is falsy', async () => {
      const tokenAddress = '0x123abc'
      walletService.account = undefined
      const mockLpContract = {
        userInfo: jest.fn(),
      } as unknown as Contract

      const result = await earnService.getTokenInfo({
        tokenAddress,
        lpContract: mockLpContract,
      })

      expect(result).toEqual({})
      expect(mockLpContract.userInfo).not.toHaveBeenCalled()
    })

    it('should handle errors and return an empty object', async () => {
      const tokenAddress = '0x123abc'
      walletService.account = '0x789def'
      const mockLpContract = {
        userInfo: jest.fn().mockRejectedValue({
          code: 4902,
        }),
      } as unknown as Contract

      const result = await earnService.getTokenInfo({
        tokenAddress,
        lpContract: mockLpContract,
      })

      expect(result).toEqual({})
      expect(mockLpContract.userInfo).toHaveBeenCalledWith(
        tokenAddress,
        walletService.account
      )
    })
  })

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
