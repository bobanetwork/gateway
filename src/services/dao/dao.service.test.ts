import { Contract, providers } from 'ethers'
import networkService from 'services/networkService'
import daoService from './dao.service'
import { ERROR_CODE } from 'util/constant'
import { Network, NetworkType } from 'util/network/network.util'
import { BOBAABI, GovernorBravoDelegateABI } from 'services/abi'
import { L2_SECONDARYFEETOKEN_ADDRESS } from 'services/app.service'
import { parseEther } from 'ethers/lib/utils'

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
      }),
    },
  }
})

describe('DaoService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })
  })
  describe('loadContract', () => {
    let contractMock: any
    let getSignerMock: any
    beforeEach(() => {
      networkService.account = '0xAccount'
      getSignerMock = jest.fn().mockReturnValue({})
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })
      ;(networkService as any).L2Provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      contractMock = {
        getBalance: jest.fn(),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
    })

    describe('loadBobaTokenContract', () => {
      it('should throw error when not connected to wallet ', async () => {
        networkService.account = undefined
        try {
          daoService.loadBobaTokenContract()
        } catch (error) {
          expect(error).toEqual(
            new Error(`${ERROR_CODE} wallet not connected!`)
          )
        }
      })

      it('should invoke contract with correct BOBA token incase of ETHEREUM network ', async () => {
        const bobaToken = 'BOBA_TOKEN_ADDRESS'
        networkService.network = Network.ETHEREUM
        networkService.tokenAddresses = {
          BOBA: {
            L2: bobaToken,
            L1: `${bobaToken}_L1`,
          },
        }
        daoService.loadBobaTokenContract()
        expect(Contract).toHaveBeenCalled()
        expect(Contract).toHaveBeenCalledWith(
          bobaToken,
          BOBAABI,
          networkService.L2Provider
        )
      })

      it('should invoke contract with correct BOBA token incase of BNB network ', async () => {
        networkService.network = Network.BNB
        daoService.loadBobaTokenContract()
        expect(Contract).toHaveBeenCalled()
        expect(Contract).toHaveBeenCalledWith(
          L2_SECONDARYFEETOKEN_ADDRESS,
          BOBAABI,
          networkService.L2Provider
        )
      })
    })

    describe('loadXBobaTokenContract', () => {
      it('should throw error when not on ETHEREUM network ', async () => {
        networkService.network = Network.BNB
        try {
          daoService.loadXBobaTokenContract()
        } catch (error) {
          expect(error).toEqual(
            new Error(`${ERROR_CODE} invalid xBoba token address`)
          )
        }
      })
      it('should throw error when not on ETHEREUM network ', async () => {
        networkService.network = Network.ETHEREUM
        networkService.networkType = NetworkType.MAINNET
        networkService.tokenAddresses = {
          xBOBA: {
            L1: 'L1_TOKEN',
            L2: 'L2_TOKEN',
          },
        }
        daoService.loadXBobaTokenContract()
        expect(Contract).toHaveBeenCalled()
        expect(Contract).toHaveBeenCalledWith('L2_TOKEN', BOBAABI, {
          getSigner: getSignerMock,
        })
      })
    })

    describe('loadDelegatorContract', () => {
      it('should throw error when GovernorBravoDelegator is invalid address', async () => {
        networkService.addresses.GovernorBravoDelegator = undefined
        try {
          daoService.loadDelegatorContract()
        } catch (error) {
          expect(error).toEqual(
            new Error(`${ERROR_CODE} invalid GovernorBravoDelegator Address`)
          )
        }
      })
      it('should return contract with address when GovernorBravoDelegator is valid address', async () => {
        networkService.addresses.GovernorBravoDelegator =
          '0xGovernorBravoDelegator'
        daoService.loadDelegatorContract()
        expect(Contract).toHaveBeenCalled()
        expect(Contract).toHaveBeenCalledWith(
          '0xGovernorBravoDelegator',
          GovernorBravoDelegateABI,
          { getSigner: getSignerMock }
        )
      })
    })
    describe('checkWalletConnection', () => {
      it('should throw error when wallet not connected ', async () => {
        networkService.account = undefined
        try {
          daoService.checkWalletConnection()
        } catch (error) {
          expect(error).toEqual(
            new Error(`${ERROR_CODE} wallet not connected!`)
          )
        }
      })
    })
  })

  describe('With Mock Contract', () => {
    let contractMock: any
    let balanceOfMock: any
    let getCurrentVotesMock: any
    let delegateMock: any
    let proposalThresholdMock: any
    let queueMock: any
    let executeMock: any
    let castVoteMock: any
    let proposeMock: any
    const contractError = new Error('Contract Fails')
    const mockFn = { wait: jest.fn() }
    beforeEach(() => {
      balanceOfMock = jest.fn().mockReturnValue(parseEther('0.002'))
      getCurrentVotesMock = jest.fn().mockReturnValue(parseEther('230'))
      proposalThresholdMock = jest.fn().mockReturnValue(parseEther('5000'))
      delegateMock = jest.fn().mockReturnValue(mockFn)
      queueMock = jest.fn().mockReturnValue('DONE')
      executeMock = jest.fn().mockReturnValue('DONE')
      castVoteMock = jest.fn().mockReturnValue('DONE')
      proposeMock = jest.fn().mockReturnValue('PROPOSE')
      contractMock = {
        connect: jest.fn().mockReturnValue({
          delegate: delegateMock,
          queue: queueMock,
          execute: executeMock,
          castVote: castVoteMock,
          propose: proposeMock,
        }),
        proposalThreshold: proposalThresholdMock,
        balanceOf: balanceOfMock,
        getCurrentVotes: getCurrentVotesMock,
      }
      jest
        .spyOn(daoService, 'checkWalletConnection')
        .mockReturnValue(contractMock)
      jest
        .spyOn(daoService, 'loadBobaTokenContract')
        .mockReturnValue(contractMock)
      jest
        .spyOn(daoService, 'loadDelegatorContract')
        .mockReturnValue(contractMock)
      jest
        .spyOn(daoService, 'loadXBobaTokenContract')
        .mockReturnValue(contractMock)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: jest.fn(),
      })
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
    })

    describe('loadBobaBalance', () => {
      it('should correctly invoke function and return value', async () => {
        const result = await daoService.loadBobaBalance()
        expect(result).toEqual({
          balance: '0.002',
        })
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          balanceOf: balanceOfMock.mockRejectedValue(contractError),
        }
        jest
          .spyOn(daoService, 'loadBobaTokenContract')
          .mockReturnValue(contractMock)
        const result = await daoService.loadBobaBalance()
        expect(result).toBe(contractError)
      })
    })

    describe('loadXBobaBalance', () => {
      it('should correctly invoke function and return value', async () => {
        const result = await daoService.loadXBobaBalance()
        expect(result).toEqual({
          balanceX: '0.002',
        })
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          balanceOf: balanceOfMock.mockRejectedValue(contractError),
        }
        jest
          .spyOn(daoService, 'loadXBobaTokenContract')
          .mockReturnValue(contractMock)
        const result = await daoService.loadXBobaBalance()
        expect(result).toBe(contractError)
      })
    })

    describe('loadBobaVotes', () => {
      it('should correctly invoke function and return value', async () => {
        const result = await daoService.loadBobaVotes()
        expect(result).toEqual({
          votes: '230.0',
        })
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          getCurrentVotes: getCurrentVotesMock.mockRejectedValue(contractError),
        }
        jest
          .spyOn(daoService, 'loadBobaTokenContract')
          .mockReturnValue(contractMock)
        const result = await daoService.loadBobaVotes()
        expect(result).toBe(contractError)
      })
    })

    describe('loadXBobaVotes', () => {
      it('should correctly invoke function and return value', async () => {
        const result = await daoService.loadXBobaVotes()
        expect(result).toEqual({
          votesX: '230.0',
        })
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          getCurrentVotes: getCurrentVotesMock.mockRejectedValue(contractError),
        }
        jest
          .spyOn(daoService, 'loadXBobaTokenContract')
          .mockReturnValue(contractMock)
        const result = await daoService.loadXBobaVotes()
        expect(result).toBe(contractError)
      })
    })

    describe('delegateBobaVotes', () => {
      it('should correctly invoke function and return value', async () => {
        const result = await daoService.delegateBobaVotes({ recipient: '0xr' })
        expect(result).toEqual(mockFn)
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          connect: jest.fn().mockReturnValue({
            delegate: delegateMock.mockRejectedValue(contractError),
          }),
        }
        jest
          .spyOn(daoService, 'loadBobaTokenContract')
          .mockReturnValue(contractMock)
        const result = await daoService.delegateBobaVotes({ recipient: '0xr' })
        expect(result).toBe(contractError)
      })
    })

    describe('delegateXBobaVotes', () => {
      it('should correctly invoke function and return', async () => {
        const result = await daoService.delegateXBobaVotes({ recipient: '0xr' })
        expect(result).toEqual(mockFn)
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          connect: jest.fn().mockReturnValue({
            delegate: delegateMock.mockRejectedValue(contractError),
          }),
        }
        jest
          .spyOn(daoService, 'loadXBobaTokenContract')
          .mockReturnValue(contractMock)
        const result = await daoService.delegateXBobaVotes({ recipient: '0xr' })
        expect(result).toBe(contractError)
      })
    })

    describe('loadProposalThreshold', () => {
      it('should correctly invoke function and return', async () => {
        const result = await daoService.loadProposalThreshold()
        expect(result).toEqual({ proposalThreshold: '5000.0' })
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          proposalThreshold:
            proposalThresholdMock.mockRejectedValue(contractError),
        }
        jest
          .spyOn(daoService, 'loadDelegatorContract')
          .mockReturnValue(contractMock)
        const result = await daoService.loadProposalThreshold()
        expect(result).toBe(contractError)
      })
    })

    describe('queueProposal', () => {
      it('should correctly invoke function and return', async () => {
        const result = await daoService.queueProposal('1')
        expect(result).toEqual('DONE')
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          connect: jest.fn().mockReturnValue({
            delegate: delegateMock,
            queue: queueMock.mockRejectedValue(contractError),
            execute: executeMock,
            castVote: castVoteMock,
          }),
        }
        jest
          .spyOn(daoService, 'loadDelegatorContract')
          .mockReturnValue(contractMock)
        const result = await daoService.queueProposal('1')
        expect(result).toBe(contractError)
      })
    })

    describe('executeProposal', () => {
      it('should correctly invoke function and return', async () => {
        const result = await daoService.executeProposal('1')
        expect(result).toEqual('DONE')
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          connect: jest.fn().mockReturnValue({
            delegate: delegateMock,
            queue: queueMock,
            execute: executeMock.mockRejectedValue(contractError),
            castVote: castVoteMock,
          }),
        }
        jest
          .spyOn(daoService, 'loadDelegatorContract')
          .mockReturnValue(contractMock)
        const result = await daoService.executeProposal('1')
        expect(result).toBe(contractError)
      })
    })

    describe('castVote', () => {
      it('should correctly invoke function and return', async () => {
        const result = await daoService.castVote({ id: '1', userVote: '1' })
        expect(result).toEqual('DONE')
      })
      it('should throw error incase contract functions fails', async () => {
        contractMock = {
          connect: jest.fn().mockReturnValue({
            delegate: delegateMock,
            queue: queueMock,
            execute: executeMock,
            castVote: castVoteMock.mockRejectedValue(contractError),
          }),
        }
        jest
          .spyOn(daoService, 'loadDelegatorContract')
          .mockReturnValue(contractMock)
        const result = await daoService.castVote({ id: 1, userVote: '1' })
        expect(result).toBe(contractError)
      })
    })

    describe('createProposal', () => {
      beforeEach(() => {
        networkService.addresses.L2LPAddress = 'L2LPAddress'
      })
      it('should call create proposal with values for change threshold', async () => {
        const result = await daoService.createProposal({
          action: 'change-threshold',
          value: [1, 2, 3],
        })
        expect(proposeMock).toHaveBeenCalled()
        expect(proposeMock).toHaveBeenCalledWith(
          [undefined],
          [0],
          ['_setProposalThreshold(uint256)'],
          [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
          ],
          'Change Proposal Threshold to 1 BOBA'
        )
        expect(result).toBe('PROPOSE')
      })
      it('should call create proposal with values for text proposal', async () => {
        const result = await daoService.createProposal({
          action: 'text-proposal',
          text: 'hello world data',
        })
        expect(proposeMock).toHaveBeenCalled()
        expect(proposeMock).toHaveBeenCalledWith(
          ['0x000000000000000000000000000000000000dEaD'],
          [0],
          [''],
          [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          ],
          'hello world data'
        )
        expect(result).toBe('PROPOSE')
      })
      it('should call create proposal with values for change threshold', async () => {
        const result = await daoService.createProposal({
          action: 'change-lp1-fee',
          value: [1, 2, 3],
        })
        expect(proposeMock).toHaveBeenCalled()
        expect(proposeMock).toHaveBeenCalledWith(
          ['L2LPAddress'],
          [0],
          ['configureFeeExits(uint256,uint256,uint256)'],
          [
            '0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003',
          ],
          'Change L1 LP Bridge fee to 1, 2, and 3 integer percent'
        )
        expect(result).toBe('PROPOSE')
      })
      it('should call create proposal with values for change threshold', async () => {
        const result = await daoService.createProposal({
          action: 'change-lp2-fee',
          value: [1, 2, 3],
        })
        expect(proposeMock).toHaveBeenCalled()
        expect(proposeMock).toHaveBeenCalledWith(
          ['L2LPAddress'],
          [0],
          ['configureFee(uint256,uint256,uint256)'],
          [
            '0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003',
          ],
          'Change L2 LP Bridge fee to 1, 2, and 3 integer percent'
        )
        expect(result).toBe('PROPOSE')
      })

      it('should throw error incase contract function fails', async () => {
        contractMock = {
          connect: jest.fn().mockReturnValue({
            propose: proposeMock.mockRejectedValue(contractError),
          }),
        }
        jest
          .spyOn(daoService, 'loadDelegatorContract')
          .mockReturnValue(contractMock)

        const result = await daoService.createProposal({
          action: 'change-threshold',
          value: [1, 2, 3],
        })
        expect(proposeMock).toHaveBeenCalled()
        expect(proposeMock).toHaveBeenCalledWith(
          [undefined],
          [0],
          ['_setProposalThreshold(uint256)'],
          [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
          ],
          'Change Proposal Threshold to 1 BOBA'
        )
        expect(result).toBe(contractError)
      })
    })
  })
})
