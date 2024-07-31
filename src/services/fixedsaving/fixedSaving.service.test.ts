import networkService from 'services/networkService'
import fixedSavingService from './fixedSaving.service'
import { ERROR_CODE } from 'util/constant'
import { BigNumber, Contract, providers } from 'ethers'
import { BOBAABI, BobaFixedSavingsABI } from 'services/abi'
import { Network } from 'util/network/network.util'
import { L2_SECONDARYFEETOKEN_ADDRESS } from 'services/app.service'

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

describe('FixedSavingService', () => {
  describe('Load Contract', () => {
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
          fixedSavingService.loadBobaTokenContract()
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
        fixedSavingService.loadBobaTokenContract()
        expect(Contract).toHaveBeenCalled()
        expect(Contract).toHaveBeenCalledWith(
          bobaToken,
          BOBAABI,
          networkService.L2Provider
        )
      })

      it('should invoke contract with correct BOBA token incase of BNB network ', async () => {
        networkService.network = Network.BNB
        fixedSavingService.loadBobaTokenContract()
        expect(Contract).toHaveBeenCalled()
        expect(Contract).toHaveBeenCalledWith(
          L2_SECONDARYFEETOKEN_ADDRESS,
          BOBAABI,
          networkService.L2Provider
        )
      })
    })
    describe('loadFixedSavingContract', () => {
      it('should throw error when not connected to wallet ', async () => {
        networkService.account = undefined
        try {
          fixedSavingService.loadFixedSavingContract()
        } catch (error) {
          expect(error).toEqual(
            new Error(`${ERROR_CODE} wallet not connected!`)
          )
        }
      })
      it('should throw error incase of invalid address ', async () => {
        networkService.addresses.BobaFixedSavings = undefined
        try {
          fixedSavingService.loadFixedSavingContract()
        } catch (error) {
          expect(error).toEqual(
            new Error(`${ERROR_CODE} invalid fixed saving account!`)
          )
        }
      })
      it('should return contract with correctly invoking the address', async () => {
        const ContractAddress = '0xContractAddress'
        networkService.account = '0xAccount'
        networkService.addresses.BobaFixedSavings = ContractAddress

        fixedSavingService.loadFixedSavingContract()
        expect(Contract).toHaveBeenCalledWith(
          ContractAddress,
          BobaFixedSavingsABI,
          {}
        )
      })
    })
  })

  describe('with loaded contract', () => {
    let mockContract: any
    let allowanceMock: any
    let approveMock: any
    let stakeMock: any
    let unstakeMock: any
    let getSignerMock: any
    let personalStakeCountMock: any
    beforeEach(() => {
      allowanceMock = jest.fn().mockReturnValue(BigNumber.from(1))
      approveMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      stakeMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      unstakeMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      personalStakeCountMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      mockContract = {
        connect: jest.fn().mockReturnValue({
          allowance: allowanceMock,
          approve: approveMock,
          personalStakeCount: personalStakeCountMock,
        }),
        stake: stakeMock,
        unstake: unstakeMock,
      }

      jest
        .spyOn(fixedSavingService, 'loadBobaTokenContract')
        .mockReturnValue(mockContract)
      jest
        .spyOn(fixedSavingService, 'loadFixedSavingContract')
        .mockReturnValue(mockContract)

      networkService.account = '0xAccount'

      getSignerMock = jest.fn().mockReturnValue({})
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
    })

    describe('addSavings', () => {
      it('should correctly invoke stake function with amount incase of valid allowance', async () => {
        const mock = { wait: jest.fn() }
        mockContract.stake.mockReturnValue(mock)
        const result = await fixedSavingService.addSavings('20')
        expect(mockContract.stake).toHaveBeenCalledWith('20')
        expect(mock.wait).toHaveBeenCalled()
        expect(result).toBe(mock)
      })
      it('should invoke arppove before staking if allowance is not valid.', async () => {
        networkService.addresses.BobaFixedSavings = '0xBobaFixedSavings'
        const approveM = { wait: jest.fn() }
        const stakeM = { wait: jest.fn() }
        approveMock.mockReturnValue(approveM)
        allowanceMock.mockReturnValue(BigNumber.from('100000000000'))
        mockContract.stake.mockReturnValue(stakeM)
        const amount = '20'
        await fixedSavingService.addSavings(amount)
        expect(mockContract.stake).toHaveBeenCalledWith(amount)
        expect(approveMock).toHaveBeenCalled()
        let apAmount = BigNumber.from(amount)
        apAmount = apAmount.add(BigNumber.from('1000000000000'))
        expect(approveMock).toHaveBeenCalledWith(
          networkService.addresses.BobaFixedSavings,
          apAmount
        )
        expect(approveM.wait).toHaveBeenCalled()
        expect(stakeM.wait).toHaveBeenCalled()
      })

      it('should throw error in case stake fails ', async () => {
        const error = new Error('failed to invoke stake')
        mockContract.stake.mockRejectedValue(error)
        const result = await fixedSavingService.addSavings('20')
        expect(result).toEqual(error)
      })
    })

    describe('withdrawSavings', () => {
      it('should throw error in case unstake fails ', async () => {
        const mock = { wait: jest.fn() }
        mockContract.unstake.mockReturnValue(mock)
        const result = await fixedSavingService.withdrawSavings(2)
        expect(unstakeMock).toHaveBeenCalled()
        expect(unstakeMock).toHaveBeenCalledWith(2)
        expect(mock.wait).toHaveBeenCalled()
        expect(result).toEqual(mock)
      })

      it('should throw error in case unstake fails ', async () => {
        const error = new Error('failed to invoke stake')
        mockContract.unstake.mockRejectedValue(error)
        const result = await fixedSavingService.withdrawSavings(2)
        expect(result).toEqual(error)
      })
    })
    describe('loadSavings', () => {
      it('should load stakecount correctly', async () => {
        personalStakeCountMock.mockReturnValue(2)
        mockContract = {
          connect: jest.fn().mockReturnValue({
            personalStakeCount: personalStakeCountMock,
          }),
        }
        jest
          .spyOn(fixedSavingService, 'loadFixedSavingContract')
          .mockReturnValue(mockContract)
        const result = await fixedSavingService.loadSavings()
        expect(result).toEqual({
          stakecount: 2,
        })
      })

      it('should throw error in load savings failes fails ', async () => {
        const error = new Error('failed to invoke stake')
        personalStakeCountMock.mockRejectedValue(error)
        mockContract = {
          connect: jest.fn().mockReturnValue({
            personalStakeCount: personalStakeCountMock,
          }),
        }
        jest
          .spyOn(fixedSavingService, 'loadFixedSavingContract')
          .mockReturnValue(mockContract)
        const result = await fixedSavingService.loadSavings()
        expect(result).toEqual(error)
      })
    })
    describe('loadAccountSaveInfo', () => {
      it('should load account save info correct for stakeCount of 1 ', async () => {
        personalStakeCountMock.mockReturnValue(1)
        const personalStakePosMock = jest.fn().mockReturnValue(2)
        const stakeDataMapMock = jest.fn().mockReturnValue({
          depositTimestamp: '123123',
          depositAmount: 2,
          isActive: true,
        })
        mockContract = {
          connect: jest.fn().mockReturnValue({
            personalStakeCount: personalStakeCountMock,
            personalStakePos: personalStakePosMock,
            stakeDataMap: stakeDataMapMock,
          }),
        }
        jest
          .spyOn(fixedSavingService, 'loadFixedSavingContract')
          .mockReturnValue(mockContract)
        const result = await fixedSavingService.loadAccountSaveInfo()
        expect(result).toEqual({
          stakeInfo: [
            {
              depositAmount: '0.000000000000000002',
              depositTimestamp: 123123,
              isActive: true,
              stakeId: 2,
            },
          ],
        })
      })
      it('should throw error in load savings failes fails ', async () => {
        const error = new Error('failed to invoke stake')
        personalStakeCountMock.mockRejectedValue(error)
        mockContract = {
          connect: jest.fn().mockReturnValue({
            personalStakeCount: personalStakeCountMock,
          }),
        }
        jest
          .spyOn(fixedSavingService, 'loadFixedSavingContract')
          .mockReturnValue(mockContract)
        const result = await fixedSavingService.loadAccountSaveInfo()
        expect(result).toEqual(error)
      })
    })
  })
})
