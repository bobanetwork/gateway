import networkService from 'services/networkService'
import { bridgeService } from './bridge.services'
import { ERROR_CODE } from 'util/constant'
import { BigNumber, Contract, providers } from 'ethers'

jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers')
  return {
    __esModule: true,
    ...originalModule,
    Contract: jest.fn(),
    providers: {
      JsonRpcProvider: jest.fn().mockReturnValue({
        getSigner: jest.fn(),
        send: jest.fn(),
      }),
      StaticJsonRpcProvider: jest.fn().mockReturnValue({
        getSigner: jest.fn(),
      }),
    },
  }
})

describe('BridgeService', () => {
  let contractMock: any
  let getSignerMock: any
  let depositTransactionMock: any
  let depositERC20TransactionMock: any
  let sendTransactionMock: any
  let balanceOfMock: any
  let depositTransactionWait: any
  let depositERC20TransactionWait: any
  let sendTransactionWait: any
  let depositERC20Wait: any
  let depositERC20Mock: any
  let finalizeWithdrawalTransactionMock: any
  let initiateWithdrawalMock: any
  let initiateWithdrawalWait: any
  let getAddressMock: any
  let approveMockWait: any
  let approveMock: any
  let withdrawMockWait: any
  let withdrawMock: any
  let allowanceMock: any
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })

    networkService.account = '0xAccount'
    networkService.addresses.OptimismPortalProxy = '0xOP'
    networkService.addresses.L1StandardBridgeProxy = '0xL1SB'
    networkService.tokenAddresses = {
      BOBA: {
        L1: 'L1_TOKEN',
        L2: 'L2_TOKEN',
      },
    }

    depositTransactionWait = jest.fn().mockReturnValue(true)
    sendTransactionWait = jest.fn().mockReturnValue('done')
    depositERC20TransactionWait = jest.fn().mockReturnValue('done')
    depositERC20Wait = jest.fn().mockReturnValue('done')
    approveMockWait = jest.fn().mockReturnValue('done')
    withdrawMockWait = jest.fn().mockReturnValue({ blockNumber: 12356 })
    getAddressMock = jest.fn().mockReturnValue('0xAddressMock')
    initiateWithdrawalWait = jest.fn().mockReturnValue({ blockNumber: 12356 })
    finalizeWithdrawalTransactionMock = jest.fn().mockReturnValue(20)
    allowanceMock = jest.fn().mockReturnValue(BigNumber.from('5'))
    depositERC20Mock = jest.fn().mockReturnValue({ wait: depositERC20Wait })
    approveMock = jest.fn().mockReturnValue({ wait: approveMockWait })
    withdrawMock = jest.fn().mockReturnValue({ wait: withdrawMockWait })
    depositTransactionMock = jest
      .fn()
      .mockReturnValue({ wait: depositTransactionWait })
    sendTransactionMock = jest
      .fn()
      .mockReturnValue({ wait: sendTransactionWait })
    depositERC20TransactionMock = jest
      .fn()
      .mockReturnValue({ wait: depositERC20TransactionWait })
    balanceOfMock = jest.fn().mockReturnValue(BigNumber.from(3))
    initiateWithdrawalMock = jest.fn().mockReturnValue({
      wait: initiateWithdrawalWait,
    })
    getSignerMock = jest.fn().mockReturnValue({
      sendTransaction: sendTransactionMock,
      getAddress: getAddressMock,
    })
    ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
      getSigner: getSignerMock,
    })

    networkService.provider = new providers.JsonRpcProvider('http://demo.local')

    contractMock = {
      attach: jest.fn().mockReturnValue({
        balanceOf: balanceOfMock,
        allowance: jest.fn().mockReturnValue(BigNumber.from('5')),
      }),
      allowance: allowanceMock,
      approve: approveMock,
      withdraw: withdrawMock,
      connect: jest.fn().mockReturnValue({
        depositTransaction: depositTransactionMock,
        depositERC20Transaction: depositERC20TransactionMock,
        depositERC20: depositERC20Mock,
        depositERC20To: depositERC20Mock,
      }),
      initiateWithdrawal: initiateWithdrawalMock,
      estimateGas: {
        finalizeWithdrawalTransaction: finalizeWithdrawalTransactionMock,
      },
    }
    ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
  })

  describe('anchorageDepositNative', () => {
    it('should invoke deposittransaction incase of recipient', async () => {
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(depositTransactionMock).toHaveBeenCalled()
      expect(depositTransactionMock).toHaveBeenCalledWith(
        '0xrecipient',
        0,
        100000,
        false,
        [],
        { value: '2' }
      )
      expect(depositTransactionWait).toHaveBeenCalled()
      expect(result).toBe(true)
    })
    it('should invoke sendTransaction incase of no recipient', async () => {
      const result = await bridgeService.anchorageDepositNative({
        amount: '2',
      })
      expect(sendTransactionMock).toHaveBeenCalled()
      expect(sendTransactionMock).toHaveBeenCalledWith({
        to: undefined,
        value: '2',
      })
      expect(sendTransactionWait).toHaveBeenCalled()
      expect(result).toBe('done')
    })

    it('should throw error incase the wallet not connected!', async () => {
      networkService.account = undefined
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} wallet not connected!`))
    })

    it('should throw error incase of invalid optimism portal address!', async () => {
      networkService.addresses.OptimismPortalProxy = undefined
      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} invalid optimism portal address`)
      )
    })

    it('should throw error incase of invalid optimism portal address!', async () => {
      getSignerMock.mockReturnValue(null)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })

      networkService.provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const result = await bridgeService.anchorageDepositNative({
        recipient: '0xrecipient',
        amount: '2',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} no signer found`))
    })
  })
  describe('anchorageDepositERC20', () => {
    it('should invoke anchorageDepositERC20 when token allowed to bridge to self', async () => {
      const result = await bridgeService.anchorageDepositERC20({
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcl2',
      })
      expect(depositERC20Mock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalledWith(
        '0xc',
        '0xcl2',
        '2',
        999999,
        '0x'
      )
      expect(depositERC20Wait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should invoke anchorageDepositERC20 with recipient address when token allowed to bridge to recipient', async () => {
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcl2',
      })
      expect(depositERC20Mock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalledWith(
        '0xc',
        '0xcl2',
        'recipient',
        '2',
        999999,
        '0x'
      )
      expect(depositERC20Wait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should invoke approve and depositERC20Transaction when token is not allowed to bridge to recipient', async () => {
      approveMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      contractMock = {
        attach: jest.fn().mockReturnValue({
          balanceOf: balanceOfMock,
          allowance: jest.fn().mockReturnValue(BigNumber.from('1')),
          connect: jest.fn().mockReturnValue({
            approve: approveMock,
          }),
        }),
        connect: jest.fn().mockReturnValue({
          depositERC20: depositERC20Mock,
          depositERC20To: depositERC20Mock,
        }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xc',
      })
      expect(approveMock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalled()
      expect(depositERC20Mock).toHaveBeenCalledWith(
        '0xc',
        '0xc',
        'recipient',
        '2',
        999999,
        '0x'
      )
      expect(depositERC20Wait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should throw error incase the wallet not connected!', async () => {
      networkService.account = undefined
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcL2',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} wallet not connected!`))
    })

    it('should throw error incase the L1StandardBridgeProxy is invalid!', async () => {
      networkService.addresses.L1StandardBridgeProxy = undefined
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xcL2',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} invalid L1StandardBridge address`)
      )
    })

    it('should throw error incase of no signer found!', async () => {
      getSignerMock.mockReturnValue(null)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })

      networkService.provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const result = await bridgeService.anchorageDepositERC20({
        recipient: '0xrecipient',
        amount: '2',
        currency: '0xc',
        currencyL2: '0xc',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} no signer found!`))
    })

    it('should throw error in case of insufficient L1 token balance', async () => {
      const result = await bridgeService.anchorageDepositERC20({
        recipient: 'recipient',
        amount: '4',
        currency: '0xc',
        currencyL2: '0xcL2',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} insufficient L1 token balance`)
      )
    })
  })
  describe('anchorageDepositERC20Optimism', () => {
    it('should invoke depositERC20Transaction when token allowed to bridge to self', async () => {
      const result = await bridgeService.anchorageDepositERC20Optimism({
        amount: '2',
        currency: '0xc',
      })
      expect(depositERC20TransactionWait).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalledWith(
        '0xAccount',
        '2',
        0,
        100000,
        false,
        []
      )
      expect(result).toEqual('done')
    })

    it('should invoke depositERC20Transaction when token allowed to bridge to recipient', async () => {
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
      })
      expect(depositERC20TransactionWait).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalledWith(
        'recipient',
        0,
        '2',
        100000,
        false,
        []
      )
      expect(result).toEqual('done')
    })
    it('should invoke approve and depositERC20Transaction when token is not allowed to bridge to recipient', async () => {
      approveMock = jest.fn().mockReturnValue({ wait: jest.fn() })
      contractMock = {
        attach: jest.fn().mockReturnValue({
          balanceOf: balanceOfMock,
          allowance: jest.fn().mockReturnValue(BigNumber.from('1')),
          connect: jest.fn().mockReturnValue({
            approve: approveMock,
          }),
        }),
        connect: jest.fn().mockReturnValue({
          depositTransaction: depositTransactionMock,
          depositERC20Transaction: depositERC20TransactionMock,
        }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
      })
      expect(approveMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalled()
      expect(depositERC20TransactionMock).toHaveBeenCalledWith(
        'recipient',
        0,
        '2',
        100000,
        false,
        []
      )
      expect(depositERC20TransactionWait).toHaveBeenCalled()
      expect(result).toEqual('done')
    })

    it('should throw error in case of insufficient L1 token balance', async () => {
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '4',
        currency: '0xc',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} insufficient L1 token balance`)
      )
    })

    it('should throw error incase the wallet not connected!', async () => {
      networkService.account = undefined
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: 'recipient',
        amount: '2',
        currency: '0xc',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} wallet not connected!`))
    })

    it('should throw error incase of invalid optimism portal address!', async () => {
      networkService.addresses.OptimismPortalProxy = undefined
      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: '0xrecipient',
        amount: '2',
        currency: '0xc',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} invalid optimismPortalProxy address`)
      )
    })

    it('should throw error incase of no signer found!', async () => {
      getSignerMock.mockReturnValue(null)
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })

      networkService.provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const result = await bridgeService.anchorageDepositERC20Optimism({
        recipient: '0xrecipient',
        amount: '2',
        currency: '0xc',
      })
      expect(result).toEqual(new Error(`${ERROR_CODE} no signer found`))
    })
  })

  describe('estimateGasFinalWithdrawal', () => {
    it('Should throw error incase no logs found', async () => {
      const reswithempty = await bridgeService.estimateGasFinalWithdrawal({
        logs: [],
      })
      expect(reswithempty).toEqual(
        new Error(`${ERROR_CODE} invalid logs passed!`)
      )
      const reswithelement = await bridgeService.estimateGasFinalWithdrawal({
        logs: [undefined],
      })
      expect(reswithelement).toEqual(
        new Error(`${ERROR_CODE} invalid logs passed!`)
      )
    })
    it('Should throw error incase no optimism portal address found', async () => {
      networkService.addresses.OptimismPortalProxy = undefined
      const response = await bridgeService.estimateGasFinalWithdrawal({
        logs: [
          {
            nonce: 0.9,
            sender: 0.9,
            target: 0.9,
            value: 0.9,
            gasLimit: 0.9,
            data: ['0x'],
          },
        ],
      })
      expect(response).toEqual(
        new Error(`${ERROR_CODE} OptimismPortal invalid address!`)
      )
    })
    it('Should invoke finalizeWithdrawalTransaction for estimating gas', async () => {
      networkService.addresses.OptimismPortalProxy = '0xoptimismPortalAddress'
      networkService.L1Provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )
      const response = await bridgeService.estimateGasFinalWithdrawal({
        logs: [
          {
            nonce: 0.9,
            sender: 0.9,
            target: 0.9,
            value: 0.9,
            gasLimit: 0.9,
            data: ['0x'],
          },
        ],
      })
      expect(response).toEqual(20) // value return from mock.
    })
  })

  describe('finalizeTransactionWithdrawal', () => {
    it('Should throw error incase no logs found', async () => {
      const reswithempty = await bridgeService.finalizeTransactionWithdrawal({
        logs: [],
      })
      expect(reswithempty).toEqual(
        new Error(`${ERROR_CODE} invalid logs passed!`)
      )
      const reswithelement = await bridgeService.finalizeTransactionWithdrawal({
        logs: [undefined],
      })
      expect(reswithelement).toEqual(
        new Error(`${ERROR_CODE} invalid logs passed!`)
      )
    })
    it('Should throw error incase no optimism portal address found', async () => {
      networkService.addresses.OptimismPortalProxy = undefined
      const response = await bridgeService.finalizeTransactionWithdrawal({
        logs: [
          {
            nonce: 0.9,
            sender: 0.9,
            target: 0.9,
            value: 0.9,
            gasLimit: 0.9,
            data: ['0x'],
          },
        ],
      })
      expect(response).toEqual(
        new Error(`${ERROR_CODE} OptimismPortal invalid address!`)
      )
    })

    it('Should invoke finalizewithdrawalTransaction', async () => {
      networkService.addresses.OptimismPortalProxy = '0xOptimismPortalProxy'
      finalizeWithdrawalTransactionMock = jest.fn().mockReturnValue({
        wait: jest.fn().mockReturnValue(220),
      })

      contractMock = {
        finalizeWithdrawalTransaction: finalizeWithdrawalTransactionMock,
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      const res = await bridgeService.finalizeTransactionWithdrawal({
        logs: [
          {
            nonce: 0.9,
            sender: 0.9,
            target: 0.9,
            value: 0.9,
            gasLimit: 0.9,
            data: ['0x'],
          },
        ],
      })

      expect(res).toEqual(220)
      expect(finalizeWithdrawalTransactionMock).toHaveBeenCalled()
    })
  })

  describe('anchorageWithdrawNativeToken', () => {
    it('should throw error incase of eth network when L2StandardBridgAddress undefined', async () => {
      networkService.addresses.L2StandardBridgeAddress = undefined
      const result = await bridgeService.anchorageWithdrawNativeToken({
        amount: '20.0',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} L2StandardBridge invalid address!`)
      )
    })
    it('should invoke send transaction and return valid response ', async () => {
      networkService.addresses.L2StandardBridgeAddress =
        '0xL2StandardBridgAddress'
      await bridgeService.anchorageWithdrawNativeToken({
        isActiveNetworkBnb: false,
        amount: '20.0',
      })
      expect(sendTransactionMock).toHaveBeenCalled()
      expect(sendTransactionMock).toHaveBeenCalledWith({
        to: '0xL2StandardBridgAddress',
        value: '20.0',
      })
    })
    it('should invoke and intwithdrawal and return block number for bnbnetwork', async () => {
      const res = await bridgeService.anchorageWithdrawNativeToken({
        isActiveNetworkBnb: true,
        amount: '20.0',
      })
      expect(res).toEqual(12356)
      expect(initiateWithdrawalMock).toHaveBeenCalled()
      expect(initiateWithdrawalMock).toHaveBeenCalledWith(
        '0xAccount',
        100000,
        [],
        { value: '20.0' }
      )
    })
  })

  describe('anchorageWithdrawErc20Token', () => {
    it('should throw error when L2StandardBridgAddress invalid', async () => {
      networkService.addresses.L2StandardBridgeAddress = undefined
      const result = await bridgeService.anchorageWithdrawErc20Token({
        amount: '20.2',
        token: '0xToken',
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} L2StandardBridge invalid address!`)
      )
    })
    it('should approve allowance and trigger withdraw for token', async () => {
      networkService.addresses.L2StandardBridgeAddress =
        '0xL2StandardBridgeAddress'
      const result = await bridgeService.anchorageWithdrawErc20Token({
        amount: '20',
        token: '0xToken',
      })
      expect(result).toEqual(12356)
      expect(allowanceMock).toHaveBeenCalled()
      expect(withdrawMock).toHaveBeenCalledWith('0xToken', '20', 30000, '0x')
    })
    it('should trigger withdraw for token incase allowance is already approved', async () => {
      networkService.addresses.L2StandardBridgeAddress =
        '0xL2StandardBridgeAddress'
      const result = await bridgeService.anchorageWithdrawErc20Token({
        amount: '2',
        token: '0xToken',
      })
      expect(allowanceMock).toHaveBeenCalled()
      expect(approveMock).not.toHaveBeenCalled()
      expect(withdrawMock).toHaveBeenCalled()
      expect(withdrawMock).toHaveBeenCalledWith('0xToken', '2', 30000, '0x')
      expect(result).toEqual(12356)
    })
  })

  describe('prooveTransactionWithdrawal', () => {
    it('Should throw error when L2OutputOracleProxyAddress is not found', async () => {
      networkService.addresses.L2OutputOracleProxy = undefined
      const result = await bridgeService.prooveTransactionWithdrawal({
        txInfo: {},
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} L2OutputOracle invalid address!`)
      )
    })
    it('Should throw error when OptimismPortalProxy is not found', async () => {
      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      networkService.addresses.OptimismPortalProxy = undefined
      const result = await bridgeService.prooveTransactionWithdrawal({
        txInfo: {},
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} OptimismPortal invalid address!`)
      )
    })
    it('Should throw error incase no logs found in queryFilter with transaction hash', async () => {
      const queryFilterMock = jest.fn().mockReturnValue([
        {
          args: {
            withdrawalHash: 'withdrawalHash1',
          },
        },
      ])

      contractMock = {
        queryFilter: queryFilterMock,
        filters: {
          MessagePassed: jest.fn().mockReturnValue(false),
        },
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      networkService.addresses.OptimismPortalProxy = '0xOptimismPortalProxy'
      const result = await bridgeService.prooveTransactionWithdrawal({
        txInfo: {
          withdrawalHash: 'withdrawalHash',
          blockNumber: '12356',
        },
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} No L2ToL1MessagePasser logs`)
      )
    })
    it('Should throw error incase no logs found in queryFilter with no transaction hash in args', async () => {
      const queryFilterMock = jest.fn().mockReturnValue([])

      contractMock = {
        queryFilter: queryFilterMock,
        filters: {
          MessagePassed: jest.fn().mockReturnValue(false),
        },
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      networkService.addresses.OptimismPortalProxy = '0xOptimismPortalProxy'
      const result = await bridgeService.prooveTransactionWithdrawal({
        txInfo: {
          blockNumber: '12356',
        },
      })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} No L2ToL1MessagePasser logs`)
      )
    })

    it('should throw error in case withdrawal hash is not match', async () => {
      const queryFilterMock = jest.fn().mockReturnValue([
        {
          args: {
            withdrawalHash: 'withdrawalHash',
            nonce: 0,
            sender: '0xffffffffffffffffffffffffffffffffffffffff',
            target: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
            value: BigNumber.from('1'),
            gasLimit: 21000,
            data: [],
          },
        },
      ])

      contractMock = {
        queryFilter: queryFilterMock,
        filters: {
          MessagePassed: jest.fn().mockReturnValue(false),
        },
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      networkService.addresses.OptimismPortalProxy = '0xOptimismPortalProxy'
      const result = await bridgeService.prooveTransactionWithdrawal({
        txInfo: {
          withdrawalHash: 'withdrawalHash',
          blockNumber: '12356',
        },
      })
      expect(result).toEqual(new Error(`Withdrawal hash does not match`))
    })
    it('should throw error in case withdrawal hash is matches', async () => {
      const queryFilterMock = jest.fn().mockReturnValue([
        {
          args: {
            withdrawalHash:
              '0x85c3ce92fecfa569eb114ef40c3b6fa15fd950b8c6873f89acc2cbbf91433282',
            nonce: 0,
            sender: '0xffffffffffffffffffffffffffffffffffffffff',
            target: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
            value: BigNumber.from('1'),
            gasLimit: 21000,
            data: [],
          },
        },
      ])

      const proveWithdrawalTransactionMock = jest
        .fn()
        .mockReturnValue({ wait: jest.fn() })
      contractMock = {
        queryFilter: queryFilterMock,
        proveWithdrawalTransaction: proveWithdrawalTransactionMock,
        latestBlockNumber: jest.fn().mockReturnValue(12358),
        getL2OutputIndexAfter: jest.fn().mockReturnValue(2),
        getL2Output: jest.fn().mockReturnValue({
          l2BlockNumber: {
            toNumber: jest.fn().mockReturnValue(12345),
          },
        }),
        filters: {
          MessagePassed: jest.fn().mockReturnValue(false),
        },
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      const sendMock = jest.fn().mockReturnValue({
        storageProof: [{ proof: 'proof' }],
      })
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: jest.fn(),
        send: sendMock,
      })

      networkService.L2Provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      networkService.addresses.OptimismPortalProxy = '0xOptimismPortalProxy'
      const result = await bridgeService.prooveTransactionWithdrawal({
        txInfo: {
          withdrawalHash:
            '0x85c3ce92fecfa569eb114ef40c3b6fa15fd950b8c6873f89acc2cbbf91433282',
          blockNumber: '12356',
        },
      })
      expect(result).toEqual([
        {
          args: {
            data: [],
            gasLimit: 21000,
            nonce: 0,
            sender: '0xffffffffffffffffffffffffffffffffffffffff',
            target: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
            value: BigNumber.from('01'),
            withdrawalHash:
              '0x85c3ce92fecfa569eb114ef40c3b6fa15fd950b8c6873f89acc2cbbf91433282',
          },
        },
      ])
    })
  })

  describe('proveTransactionWithdrawalWithFraudProof', () => {
    it('Should throw error incase no logs found in queryFilter with transaction hash', async () => {
      const queryFilterMock = jest.fn().mockReturnValue([])

      contractMock = {
        queryFilter: queryFilterMock,
        filters: {
          MessagePassed: jest.fn().mockReturnValue(false),
        },
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      networkService.addresses.OptimismPortalProxy = '0xOptimismPortalProxy'
      const result =
        await bridgeService.proveTransactionWithdrawalWithFraudProof({
          txInfo: {
            blockNumber: '12356',
          },
        })
      expect(result).toEqual(
        new Error(`${ERROR_CODE} No L2ToL1MessagePasser logs`)
      )
    })
    it('should throw error in case withdrawal hash is not match', async () => {
      const queryFilterMock = jest.fn().mockReturnValue([
        {
          args: {
            withdrawalHash: 'withdrawalHash',
            nonce: 0,
            sender: '0xffffffffffffffffffffffffffffffffffffffff',
            target: '0xdeaddeaddeaddeaddeaddeaddeaddeaddeaddead',
            value: BigNumber.from('1'),
            gasLimit: 21000,
            data: [],
          },
        },
      ])

      contractMock = {
        queryFilter: queryFilterMock,
        filters: {
          MessagePassed: jest.fn().mockReturnValue(false),
        },
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      networkService.addresses.L2OutputOracleProxy = '0xL2OutputOracleProxy'
      networkService.addresses.OptimismPortalProxy = '0xOptimismPortalProxy'
      const result =
        await bridgeService.proveTransactionWithdrawalWithFraudProof({
          txInfo: {
            withdrawalHash: 'withdrawalHash',
            blockNumber: '12356',
          },
        })
      expect(result).toEqual(new Error(`Withdrawal hash does not match`))
    })
  })

  describe('doesWithdrawalCanFinalized', () => {
    it('should return false when transactionhash in undefined', async () => {
      const result = await bridgeService.doesWithdrawalCanFinalized({
        transactionHash: undefined,
      })
      expect(result).toBeFalsy()
    })
    it('should invoke checkWithdrawl and return correct response', async () => {
      const checkWithdrawalMock = jest.fn().mockReturnValue('done')
      contractMock = {
        checkWithdrawal: checkWithdrawalMock,
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)

      networkService.L1Provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      const res = await bridgeService.doesWithdrawalCanFinalized({
        transactionHash: 'transactionHash',
      })
      expect(res).toBe('done')
      expect(checkWithdrawalMock).toHaveBeenCalled()
      expect(checkWithdrawalMock).toHaveBeenCalledWith(
        'transactionHash',
        '0xAccount'
      )
    })
  })
})
