import { fetchGasDetail } from 'services/gas.service'
import networkService from 'services/networkService'

jest.mock('services/networkService')

jest.mock('services/networkService', () => {
  return {
    L1Provider: {
      getFeeData: jest.fn(),
      getBlockNumber: jest.fn(),
    },
    L2Provider: {
      getFeeData: jest.fn(),
      getBlockNumber: jest.fn(),
    },
  }
})

describe('fetchGasDetail', () => {
  beforeEach(() => {
    networkService.L1Provider.getFeeData.mockClear()
    networkService.L2Provider.getFeeData.mockClear()
    networkService.L1Provider.getBlockNumber.mockClear()
    networkService.L2Provider.getBlockNumber.mockClear()
  })

  test('Should fetch gas details successfully for L1 and L2', async () => {
    networkService.L1Provider.getFeeData.mockResolvedValue({
      gasPrice: '1000000000',
    })
    networkService.L2Provider.getFeeData.mockResolvedValue({
      gasPrice: '500000000',
    })
    networkService.L1Provider.getBlockNumber.mockResolvedValue(110000)
    networkService.L2Provider.getBlockNumber.mockResolvedValue(220000)

    const result = await fetchGasDetail()

    expect(result).toEqual({
      gasL1: '1',
      gasL2: '1',
      blockL1: 110000,
      blockL2: 220000,
    })

    expect(networkService.L1Provider.getFeeData).toHaveBeenCalled()
    expect(networkService.L2Provider.getFeeData).toHaveBeenCalled()
    expect(networkService.L1Provider.getBlockNumber).toHaveBeenCalled()
    expect(networkService.L2Provider.getBlockNumber).toHaveBeenCalled()
  })
})
