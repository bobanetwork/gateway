import balanceService from './balance.service'
import { BigNumber, ethers, Contract } from 'ethers'
import networkService from './networkService'
import walletService from './wallet.service'

jest.mock('./networkService')
jest.mock('./wallet.service')

jest.mock('api/omgxWatcherAxios', () => {
  return jest.fn(() => ({
    get: jest.fn().mockResolvedValue({ data: 'asd' }),
  }))
})

jest.mock('ethers', () => {
  const actualEthers = jest.requireActual('ethers')
  return {
    ...actualEthers,
    ethers: {
      ...actualEthers.ethers,
      utils: {
        ...actualEthers.ethers.utils,
        formatEther: jest.fn().mockReturnValue('100.0'),
      },
    },
  }
})

describe('BalanceService', () => {
  let mockL2Provider: any
  const mockSymbol = jest.fn()
  const mockName = jest.fn()
  const mockDecimals = jest.fn()
  const mockBalanceOf = jest.fn()
  const mockedNetworkConfig = {
    OMGX_WATCHER_URL: `https://api-watcher.goerli.boba.network/`,
    VERIFIER_WATCHER_URL: `https://api-verifier.goerli.boba.network/`,
    META_TRANSACTION: `https://api-meta-transaction.goerli.boba.network/`,
    MM_Label: `Goerli`,
    addressManager: `0x6FF9c8FF8F0B6a0763a3030540c21aFC721A9148`,
    L1: {
      name: 'Goerli',
      chainId: 5,
      chainIdHex: '0x5',
      rpcUrl: [
        `https://goerli.gateway.tenderly.co/1clfZoq7qEGyF4SQvF8gvI`,
        `https://rpc.ankr.com/eth_goerli`,
      ],
      transaction: `https://goerli.etherscan.io/tx/`,
      blockExplorerUrl: `https://goerli.etherscan.io/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    L2: {
      name: 'BOBA Goerli L2',
      chainId: 2888,
      chainIdHex: '0xB48',
      rpcUrl: [`https://goerli.boba.network`],
      blockExplorer: `https://testnet.bobascan.com/`,
      transaction: `https://testnet.bobascan.com/tx/`,
      blockExplorerUrl: `https://testnet.bobascan.com/`,
      symbol: 'ETH',
      tokenName: 'ETH',
    },
    payloadForL1SecurityFee: {
      from: '0x122816e7A7AeB40601d0aC0DCAA8402F7aa4cDfA',
      to: '0x4df04E20cCd9a8B82634754fcB041e86c5FF085A',
      value: '0x174876e800',
      data: '0x7ff36ab500000000000000000000000000000000000000000000000003939808cc6852cc0000000000000000000000000000000000000000000000000000000000000080000000000000000000000000122816e7a7aeb40601d0ac0dcaa8402f7aa4cdfa0000000000000000000000000000000000000000000000000000008c14b4a17a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000deaddeaddeaddeaddeaddeaddeaddeaddead00000000000000000000000000004204a0af0991b2066d2d617854d5995714a79132',
    },
    payloadForFastDepositBatchCost: {
      from: '0x5E7a06025892d8Eef0b5fa263fA0d4d2E5C3B549',
      to: '0x12F8d1cD442cf1CF94417cE6309c6D2461Bd91a3',
      value: '0x038d7ea4c68000',
      data: '0xa44c80e3000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000006a6676813d3d4317442cf84667425c13553f4a760000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000038d7ea4c68000',
    },
    gasEstimateAccount: `0xdb5a187FED81c735ddB1F6E47F28f2A5F74639b2`,
    twitterFaucetPromotionText:
      'https://twitter.com/intent/tweet?text=I%27m%20developing%20on%20Boba%20Network%20',
  }
  beforeEach(() => {
    mockL2Provider = {
      getBalance: jest.fn().mockResolvedValue(BigNumber.from(100)),
    }
    networkService.networkConfig = mockedNetworkConfig
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
  describe('getL1FeeBalance', () => {
    it('should return formatted balance', async () => {
      const mockBalance = ethers.utils.parseEther('1') // 1 ETH
      networkService.L1Provider = {
        getBalance: jest.fn().mockResolvedValue(mockBalance),
      } as any

      walletService.account = '0xD63d4235f9AE67108718C0A2dAffE7BE85721BFf'

      const balance = await balanceService.getL1FeeBalance()
      expect(balance).toEqual('1.0') // Formateado como string
      expect(networkService!.L1Provider.getBalance).toHaveBeenCalledWith(
        '0xD63d4235f9AE67108718C0A2dAffE7BE85721BFf'
      )
    })
  })

  describe('getL2BalanceETH', () => {
    it('should return formatted balance for L2', async () => {
      const mockBalance = ethers.utils.parseEther('2') // 2 ETH
      networkService.L2Provider = {
        getBalance: jest.fn().mockResolvedValue(mockBalance),
      } as any

      walletService.account = '0xD63d4235f9AE67108718C0A2dAffE7BE85721BFf'

      const balance = await balanceService.getL2BalanceETH()
      expect(balance).toEqual('2.0') // Formateado como string
      expect(networkService!.L2Provider.getBalance).toHaveBeenCalledWith(
        '0xD63d4235f9AE67108718C0A2dAffE7BE85721BFf'
      )
    })
  })

  describe('getL2BalanceETH', () => {
    it('should return formatted ETH balance for L2', async () => {
      const expectedBalance = '0.0000000000000001'
      const balance = await balanceService.getL2BalanceETH()

      expect(balance).toEqual(expectedBalance)
      expect(mockL2Provider.getBalance).toHaveBeenCalledWith(
        '0xD63d4235f9AE67108718C0A2dAffE7BE85721BFf'
      )
    })
  })

  describe('getL2BalanceBOBA', () => {
    it('should return formatted BOBA token balance for L2', async () => {
      const expectedBalance = '100.0'
      const balance = await balanceService.getL2BalanceBOBA()
      expect(balance).toEqual(0)
    })
  })

  describe('L2LPPending', () => {
    it('should return "0" as a string', async () => {
      const result = await balanceService.L2LPPending(
        '0xD63d4235f9AE67108718C0A2dAffE7BE85721BFf'
      )

      expect(result).toEqual('0')
    })
  })
})
