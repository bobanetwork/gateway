import { Contract } from 'ethers'
import txBuilderService from './txbuilder.service'

describe('TxBuilderService', () => {
  describe('ParseResult Method', () => {
    test('Expected return a string for a single output', () => {
      const resultPR = 123
      const outputsPR = [{ name: 'value', type: 'uint256' }]
      const result = txBuilderService.parseResult(resultPR, outputsPR)
      expect(result).toEqual('123')
    })

    test('Expected return a JSON for multiple outputs', () => {
      const resultPR = [123, 'BobaNetwork']
      const outputsPR = [
        { name: 'value', type: 'uint256' },
        { name: 'text', type: 'string' },
      ]
      const result = txBuilderService.parseResult(resultPR, outputsPR)
      expect(result).toEqual(
        JSON.stringify([{ value: '123' }, { text: 'BobaNetwork' }])
      )
    })
  })

  describe('SubmitTxBuilder Method', () => {
    let mockContract

    beforeEach(() => {
      mockContract = {
        interface: {
          functions: {
            viewMethod: {
              stateMutability: 'view',
              outputs: [{ name: 'outputName', type: 'uint256' }],
            },
            payableMethod: {
              stateMutability: 'payable',
              outputs: [],
            },
            otherMethod: {
              stateMutability: 'other',
              outputs: [],
            },
          },
        },
        viewMethod: jest.fn().mockResolvedValue(123),
        payableMethod: jest.fn().mockResolvedValue({ hash: '0xhash' }),
        otherMethod: jest.fn().mockResolvedValue({ hash: '0xotherMethod' }),
      }
    })

    it('should handle view method correctly', async () => {
      const methodIndex = 0
      const methodName = 'viewMethod'
      const inputs = {}
      const result = await txBuilderService.submitTxBuilder(
        mockContract,
        methodIndex,
        methodName,
        inputs
      )
      expect(result).toEqual({
        methodIndex,
        result: { result: '123', err: null },
      })
      expect(mockContract.viewMethod).toHaveBeenCalled()
    })

    it('should handle payable method correctly', async () => {
      const methodIndex = 1
      const methodName = 'payableMethod'
      const inputs = { value: '1000' }
      const result = await txBuilderService.submitTxBuilder(
        mockContract,
        methodIndex,
        methodName,
        inputs
      )
      expect(result).toEqual({
        methodIndex,
        result: { transactionHash: '0xhash', err: null },
      })
      expect(mockContract.payableMethod).toHaveBeenCalledWith({ value: '1000' })
    })
    it('should handle other method correctly', async () => {
      const methodIndex = 2
      const methodName = 'otherMethod'
      const inputs = {}
      const result = await txBuilderService.submitTxBuilder(
        mockContract,
        methodIndex,
        methodName,
        inputs
      )

      expect(result).toEqual({
        methodIndex,
        result: { transactionHash: '0xotherMethod', err: null },
      })
      expect(mockContract.otherMethod).toHaveBeenCalled()
    })
  })
})
