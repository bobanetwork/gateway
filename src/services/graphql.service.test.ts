import { anchorageGraphQLService } from './graphql.service'
import { WithdrawState } from '../containers/modals/MultiStepWithdrawalModal/withdrawal'
import { BigNumber } from 'ethers'

describe('GraphQLService', () => {
  let mockProvider
  let mockNetworkConfig
  let mockNetworkService

  afterEach(() => {
    jest.restoreAllMocks()
  })
  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    const mockGetBlock = jest.fn()
    const mockGetTransaction = jest.fn()

    mockGetBlock.mockResolvedValue({
      timestamp: Date.now(),
    })
    mockGetTransaction.mockResolvedValue({
      hash: '0x00000000',
    })
    mockProvider = {
      getBlock: mockGetBlock,
      getTransaction: mockGetTransaction,
    }
    mockNetworkService = {
      L1Provider: mockProvider,
      L2Provider: mockProvider,
    }
    mockNetworkConfig = {
      L1: {
        name: 'L1Name',
        chainId: 'L1ChainId',
      },
      L2: {
        name: 'L2Name',
        chaindId: 'L2ChaindId',
      },
    }
  })

  describe('GraphQL Basic functionality', () => {
    it('should build', () => {
      expect(anchorageGraphQLService).toBeDefined()
    })
    it('should filter withdrawalHashLogs', () => {
      const bridgeLogsArr = [
        { transactionHash: '0x1' },
        { transactionHash: '0x2' },
        { transactionHash: '0x3' },
      ]
      const l2ToL1Logs = [
        { transactionHash: '0x1' },
        { transactionHash: '0x98' },
        { transactionHash: '0x99' },
      ]
      const result = anchorageGraphQLService.findWithdrawHashesFromLogs(
        bridgeLogsArr,
        l2ToL1Logs
      )
      expect(result.length).toEqual(1)
    })
  })

  describe('Deposits', () => {
    it('should map a TransactionDeposit event correctly', async () => {
      const event = {
        event: 'TransactionDeposited',
        blockHash: '1',
        transactionHash: '2',
        args: {
          amount: '0x0',
          sender: '0xSender',
          target: '0xTarget',
          from: '0xFrom',
          to: '0xTo',
          l1Token: '0xL1Token',
        },
        address: '0xAddr',
      }

      const mapped: any = await anchorageGraphQLService.mapDepositToTransaction(
        mockNetworkService,
        {
          L1: {
            name: 'L1Name',
            chainId: '0x01',
          },
          L2: {
            chainId: '0x01',
          },
        } as any,
        event as any,
        'Completed'
      )

      expect(mapped.layer).toEqual('l1')
      expect(mapped.UserFacingStatus).toEqual('Completed')
      expect(mapped.contractAddress).toEqual(event.address)
      expect(mapped.isTeleportation).toEqual(false)
    })
    it('should map a DepositFinalized event correctly', async () => {
      const event = {
        event: 'DepositFinalized',
        blockHash: '1',
        transactionHash: '2',
        args: {
          amount: '0x0',
          sender: '0xSender',
          target: '0xTarget',
          from: '0xFrom',
          to: '0xTo',
          l1Token: '0xL1Token',
        },
        address: '0xAddr',
      }
      const mapped: any = await anchorageGraphQLService.mapDepositToTransaction(
        mockNetworkService,
        {
          L1: {
            name: 'L1Name',
            chainId: '0x01',
          },
          L2: {
            chainId: '0x01',
          },
        } as any,
        event as any,
        'Completed'
      )

      expect(mapped.layer).toEqual('l1')
      expect(mapped.UserFacingStatus).toEqual('Completed')
      expect(mapped.contractAddress).toEqual(event.address)
      expect(mapped.isTeleportation).toEqual(false)
    })
  })

  describe('Withdrawals', () => {
    it('should map a WithdrawalInitiated event correctly', async () => {
      const event = {
        event: WithdrawState.initialized,
        blockHash: '1',
        transactionHash: '2',
        args: {
          amount: '0x0',
          sender: '0xSender',
          target: '0xTarget',
          from: '0xFrom',
          to: '0xTo',
          l1Token: '0xL1Token',
        },
        address: '0xAddr',
      }

      const res = await anchorageGraphQLService.mapWithdrawalToTransaction(
        mockNetworkService as any,
        mockNetworkConfig as any,
        event as any,
        WithdrawState.initialized,
        BigNumber.from(100)
      )

      expect(res).toBeDefined()
      expect(res.actionRequired).toBeDefined()
      // initials will need to submit a proof
      expect(res.actionRequired?.step).toEqual(3)
      expect(res.actionRequired?.state).toEqual(WithdrawState.initialized)
    })
    it('should map a WithdrawalProven event correctly', async () => {
      const event = {
        event: WithdrawState.proven,
        blockHash: '1',
        transactionHash: '2',
        args: {
          amount: '0x0',
          sender: '0xSender',
          target: '0xTarget',
          from: '0xFrom',
          to: '0xTo',
          l1Token: '0xL1Token',
        },
        address: '0xAddr',
      }

      const res = await anchorageGraphQLService.mapWithdrawalToTransaction(
        mockNetworkService as any,
        mockNetworkConfig as any,
        event as any,
        WithdrawState.proven,
        BigNumber.from(100)
      )

      expect(res).toBeDefined()
      expect(res.actionRequired).toBeDefined()
      // proven events will need to wait/claim
      expect(res.actionRequired?.step).toEqual(5)
      expect(res.actionRequired?.state).toEqual(WithdrawState.proven)
    })
  })
})
