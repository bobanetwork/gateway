import { BigNumber, Contract, providers } from 'ethers'
import {
  L1ERC20ABI,
  L1LiquidityPoolABI,
  L2LiquidityPoolABI,
  L2StandardERC20ABI,
} from 'services/abi'
import networkService from 'services/networkService'
import { LiquidityPoolLayer } from 'types/earn.types'
import { ERROR_CODE } from 'util/constant'
import earnService from './earn.service'

jest.mock('../networkService')
jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers')
  return {
    __esModule: true,
    ...originalModule,
    Contract: jest.fn(),
    providers: {
      JsonRpcProvider: jest.fn().mockReturnValue({
        getSigner: jest.fn(),
        getBalance: jest.fn(),
        getBlock: jest.fn(),
      }),
    },
  }
})

describe('EarnService', () => {
  let contractMock: any
  let providerMock: any
  let balanceOfMock: any
  let symbolMock: any
  let nameMock: any
  let decimalsMock: any
  let poolInfoMock: any
  let userInfoMock: any
  let withdrawRewardMock: any
  let withdrawLiquidityMock: any
  let gasWithdrawLiquidityMock: any
  let getSignerMock: any
  let getBalanceMock: any
  let getBlockMock: any
  let mockWait: any
  beforeEach(() => {
    getSignerMock = jest.fn()
    getBalanceMock = jest.fn().mockReturnValue(3)
    getBlockMock = jest.fn()
    mockWait = { wait: jest.fn() }
    providerMock = {
      getSigner: getSignerMock,
      getBalance: getBalanceMock,
      getBlock: getBlockMock.mockReturnValue({
        gasLimit: BigNumber.from('21000'),
      }),
    }
    ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue(
      providerMock
    )
    ;(networkService as any).L2Provider = new providers.JsonRpcProvider(
      'http://demo.local'
    )
    ;(networkService as any).L1Provider = new providers.JsonRpcProvider(
      'http://demo.local'
    )
    ;(networkService as any).provider = new providers.JsonRpcProvider(
      'http://demo.local'
    )

    networkService.account = '0xAccount'
    networkService.addresses.L1LPAddress = 'L1LPAddress'
    networkService.addresses.L2LPAddress = 'L2LPAddress'

    balanceOfMock = jest.fn().mockReturnValue(2)
    symbolMock = jest.fn()
    nameMock = jest.fn()
    decimalsMock = jest.fn()
    poolInfoMock = jest.fn()
    userInfoMock = jest.fn()
    withdrawRewardMock = jest.fn().mockReturnValue(mockWait)
    withdrawLiquidityMock = jest.fn()
    gasWithdrawLiquidityMock = jest.fn()
    contractMock = {
      estimateGas: {
        withdrawLiquidity: gasWithdrawLiquidityMock.mockReturnValue(
          BigNumber.from('10')
        ),
      },
      connect: jest.fn().mockReturnValue({
        withdrawReward: withdrawRewardMock,
        withdrawLiquidity: withdrawLiquidityMock.mockReturnValue(mockWait),
      }),
      balanceOf: balanceOfMock,
      symbol: symbolMock,
      name: nameMock,
      decimals: decimalsMock,
      poolInfo: poolInfoMock,
      userInfo: userInfoMock,
    }
    ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
  })

  describe('loadL1LpContract', () => {
    it('should invoke prepare contract correctly with correct params', async () => {
      networkService.addresses.L1LPAddress = 'L1LPAddress'
      earnService.loadL1LpContract()
      expect(Contract).toHaveBeenCalled()
      expect(Contract).toHaveBeenCalledWith(
        'L1LPAddress',
        L1LiquidityPoolABI,
        providerMock
      )
    })
    it('should throw error when L1LPAddress is invalid address', async () => {
      networkService.addresses.L1LPAddress = undefined
      try {
        earnService.loadL1LpContract()
      } catch (error) {
        expect(error).toEqual(new Error(`${ERROR_CODE} L1LpAddress not found!`))
      }
    })
  })

  describe('loadL2LpContract', () => {
    it('should invoke & prepare contract correctly with correct params', async () => {
      networkService.addresses.L2LPAddress = 'L2LPAddress'
      earnService.loadL2LpContract()
      expect(Contract).toHaveBeenCalled()
      expect(Contract).toHaveBeenCalledWith(
        'L2LPAddress',
        L2LiquidityPoolABI,
        providerMock
      )
    })
    it('should throw error when L2LPAddress is invalid address', async () => {
      networkService.addresses.L2LPAddress = undefined
      try {
        earnService.loadL2LpContract()
      } catch (error) {
        expect(error).toEqual(new Error(`${ERROR_CODE} L2LpAddress not found!`))
      }
    })
  })

  describe('checkWalletConnection', () => {
    it('should throw error when not connected to wallet', () => {
      try {
        networkService.account = undefined
        earnService.checkWalletConnection()
      } catch (error) {
        expect(error).toEqual(new Error(`${ERROR_CODE} wallet not connected!`))
      }
    })
  })

  describe('loadL1LpBalance', () => {
    it('should invoke getBalance with correct address and return stringify balance of L2ETH Address', async () => {
      networkService.addresses = {
        L2_BOBA_Address: 'L2_BOBA_Address',
        L1_ETH_Address: 'l1_eth_address',
        L2_ETH_Address: 'l2_eth_address',
        L1LPAddress: 'L2LPAddress',
      }
      const tokenAddress = 'TOKEN_ADDRESS'
      const res = await earnService.loadL1LpBalance(tokenAddress)
      expect(Contract).toHaveBeenCalled()
      expect(Contract).toHaveBeenCalledWith(
        'TOKEN_ADDRESS',
        L1ERC20ABI,
        networkService.L1Provider
      )
      expect(balanceOfMock).toHaveBeenCalled()
      expect(balanceOfMock).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
      expect(res).toEqual('2')
    })
    it('should invoke getBalance with correct address and return stringify balance for of L1ETH Address', async () => {
      networkService.addresses = {
        L2_BOBA_Address: 'l2_boba_address',
        L1_ETH_Address: 'l1_eth_address',
        L2_ETH_Address: 'l2_eth_address',
        L2LPAddress: 'l2lpaddress',
        L1LPAddress: 'l1lpaddress',
      }
      const res = await earnService.loadL1LpBalance(
        networkService.addresses.L2_ETH_Address
      )
      expect(getBalanceMock).toHaveBeenCalled()
      expect(getBalanceMock).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
      expect(res).toEqual('3')
    })
    it('should invoke getBalance with correct address and return stringify balance for ERC20 token', async () => {
      networkService.addresses = {
        L2_BOBA_Address: 'l2_boba_address',
        L1_ETH_Address: 'l1_eth_address',
        L2_ETH_Address: 'l2_eth_address',
        L2LPAddress: 'l2lpaddress',
        L1LPAddress: 'l1lpaddress',
      }
      const res = await earnService.loadL1LpBalance(
        networkService.addresses.L1_ETH_Address
      )
      expect(getBalanceMock).toHaveBeenCalled()
      expect(getBalanceMock).toHaveBeenCalledWith(
        networkService.addresses.L1LPAddress
      )
      expect(res).toEqual('3')
    })

    it('should throw error when balanceOf fails', async () => {
      const error = new Error('Fails to invoke')
      contractMock = {
        balanceOf: balanceOfMock.mockRejectedValue(error),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      const res = await earnService.loadL1LpBalance('TOKEN_ADDRESS')
      expect(res).toEqual(error)
    })
  })

  describe('loadL2LpBalance', () => {
    it('should invoke balanceOf with correct address and return stringify balance', async () => {
      networkService.addresses = {
        L2_BOBA_Address: 'L2_BOBA_Address',
        L1_ETH_Address: 'L1_ETH_Address',
        L2_ETH_Address: 'L2_ETH_Address',
        L2LPAddress: 'L2LPAddress',
      }
      const tokenAddress = 'TOKEN_ADDRESS'
      const res = await earnService.loadL2LpBalance(tokenAddress)
      expect(Contract).toHaveBeenCalled()
      expect(Contract).toHaveBeenCalledWith(
        'TOKEN_ADDRESS',
        L2StandardERC20ABI,
        networkService.L2Provider
      )
      expect(balanceOfMock).toHaveBeenCalled()
      expect(balanceOfMock).toHaveBeenCalledWith(
        networkService.addresses.L2LPAddress
      )
      expect(res).toEqual('2')
    })
    it('should invoke balanceOf with correct address and return stringify balance for BOBA Address', async () => {
      networkService.addresses = {
        L2_BOBA_Address: 'l2_boba_address',
        L1_ETH_Address: 'l1_eth_address',
        L2_ETH_Address: 'l2_eth_address',
        L2LPAddress: 'l2lpaddress',
      }
      const res = await earnService.loadL2LpBalance(
        networkService.addresses.L2_BOBA_Address
      )
      expect(Contract).toHaveBeenCalled()
      expect(Contract).toHaveBeenCalledWith(
        networkService.addresses.L2_ETH_Address,
        L2StandardERC20ABI,
        networkService.L2Provider
      )
      expect(balanceOfMock).toHaveBeenCalled()
      expect(balanceOfMock).toHaveBeenCalledWith(
        networkService.addresses.L2LPAddress
      )
      expect(res).toEqual('2')
    })
    it('should invoke balanceOf with correct address and return stringify balance for ETH Address', async () => {
      networkService.addresses = {
        L2_BOBA_Address: 'l2_boba_address',
        L1_ETH_Address: 'l1_eth_address',
        L2_ETH_Address: 'l2_eth_address',
        L2LPAddress: 'l2lpaddress',
      }
      const res = await earnService.loadL2LpBalance(
        networkService.addresses.L1_ETH_Address
      )
      expect(Contract).toHaveBeenCalled()
      expect(Contract).toHaveBeenCalledWith(
        networkService.addresses.L2_ETH_Address,
        L2StandardERC20ABI,
        networkService.L2Provider
      )
      expect(balanceOfMock).toHaveBeenCalled()
      expect(balanceOfMock).toHaveBeenCalledWith(
        networkService.addresses.L2LPAddress
      )
      expect(res).toEqual('2')
    })

    it('should throw error when balanceOf fails', async () => {
      const error = new Error('Fails to invoke')
      contractMock = {
        balanceOf: balanceOfMock.mockRejectedValue(error),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      const res = await earnService.loadL2LpBalance('TOKEN_ADDRESS')
      expect(res).toEqual(error)
    })
  })

  describe('loadReward', () => {
    it('should invoke withdrawReward correctly from contract in case of L1LP', async () => {
      const res = await earnService.loadReward({
        currencyAddress: '0xCurrencyAddress',
        value_Wei_String: '0.001',
        L1orL2Pool: LiquidityPoolLayer.L1LP,
      })

      expect(withdrawRewardMock).toHaveBeenCalled()
      expect(withdrawRewardMock).toHaveBeenCalledWith(
        '0.001',
        '0xCurrencyAddress',
        '0xAccount'
      )
      expect(mockWait.wait).toHaveBeenCalled()
      expect(res).toEqual(mockWait)
    })
    it('should invoke withdrawReward correctly from contract in case of L2LP', async () => {
      const res = await earnService.loadReward({
        currencyAddress: '0xCurrencyAddressL2',
        value_Wei_String: '0.001',
        L1orL2Pool: LiquidityPoolLayer.L2LP,
      })

      expect(withdrawRewardMock).toHaveBeenCalled()
      expect(withdrawRewardMock).toHaveBeenCalledWith(
        '0.001',
        '0xCurrencyAddressL2',
        '0xAccount'
      )
      expect(mockWait.wait).toHaveBeenCalled()
      expect(res).toEqual(mockWait)
    })
    it('should throw error when withdrawRewar Fails', async () => {
      const error = new Error('Fails to invoke')
      contractMock = {
        connect: jest.fn().mockReturnValue({
          withdrawReward: withdrawRewardMock.mockRejectedValue(error),
        }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      const res = await earnService.loadReward({
        currencyAddress: '0xCurrencyAddress',
        value_Wei_String: '0.001',
        L1orL2Pool: LiquidityPoolLayer.L1LP,
      })

      expect(res).toEqual(error)
    })
  })

  describe('withdrawLiquidity', () => {
    it('should invoke withdrawLiquidity correctly from contract in case of L1LP', async () => {
      const res = await earnService.withdrawLiquidity({
        currency: '0xCurrencyAddress',
        value_Wei_String: '0.001',
        L1orL2Pool: LiquidityPoolLayer.L1LP,
      })

      expect(withdrawLiquidityMock).toHaveBeenCalled()
      expect(withdrawLiquidityMock).toHaveBeenCalledWith(
        '0.001',
        '0xCurrencyAddress',
        '0xAccount',
        { gasLimit: BigNumber.from('10').mul(2) }
      )
      expect(mockWait.wait).toHaveBeenCalled()
      expect(res).toEqual(mockWait)
    })
    it('should invoke withdrawLiquidity correctly from contract in case of L2LP', async () => {
      const res = await earnService.withdrawLiquidity({
        currency: '0xCurrencyAddressL2',
        value_Wei_String: '0.001',
        L1orL2Pool: LiquidityPoolLayer.L2LP,
      })

      expect(withdrawLiquidityMock).toHaveBeenCalled()
      expect(withdrawLiquidityMock).toHaveBeenCalledWith(
        '0.001',
        '0xCurrencyAddressL2',
        '0xAccount',
        { gasLimit: BigNumber.from('10').mul(2) }
      )
      expect(mockWait.wait).toHaveBeenCalled()
      expect(res).toEqual(mockWait)
    })
    it('should throw error when withdrawRewar Fails', async () => {
      const error = new Error('Fails to invoke')
      contractMock = {
        estimateGas: {
          withdrawLiquidity: withdrawLiquidityMock.mockReturnValue(
            BigNumber.from(0)
          ),
        },
        connect: jest.fn().mockReturnValue({
          withdrawLiquidity: withdrawLiquidityMock.mockRejectedValue(error),
        }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      const res = await earnService.withdrawLiquidity({
        currency: '0xCurrencyAddress',
        value_Wei_String: '0.001',
        L1orL2Pool: LiquidityPoolLayer.L1LP,
      })
      expect(res).toEqual(error)
    })
  })
})
