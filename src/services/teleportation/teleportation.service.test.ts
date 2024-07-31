import { CHAIN_ID_LIST } from 'util/network/network.util'
import appService from '../app.service'
import { MOCK_CHAIN_LIST } from '../mock/teleporation'
import { lightBridgeService as lbs } from './teleportation.service'
import networkService from '../networkService'
import { Layer } from 'util/constant'

jest.mock('../networkService')
jest.mock('../app.service')

const addresses = {
  Proxy__L1Teleportation: 'L1_TELEPORTATION',
  Proxy__L2Teleportation: 'L2_TELEPORTATION',
}

describe('TeleportationService', () => {
  beforeEach(() => {
    jest.spyOn(appService, 'fetchAddresses').mockReturnValue(addresses)
    jest.spyOn(console, 'log').mockImplementation(() => {
      return
    })
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  describe('GetLightBridgeAddress', () => {
    test('should return L1 lightBridgeAddr for a valid L1 chainId', async () => {
      const chainId = 88
      CHAIN_ID_LIST[chainId] = MOCK_CHAIN_LIST[chainId]
      const result = await lbs.getLightBridgeAddress({ chainId })
      expect(result.lightBridgeAddress).toBe('L1_TELEPORTATION')
      expect(result.destChainConfig).toBe(MOCK_CHAIN_LIST[chainId])
    })

    test('should return L2 lightBridgeAddr for a valid L2 chainId', async () => {
      const chainId = 99
      CHAIN_ID_LIST[chainId] = MOCK_CHAIN_LIST[chainId]
      const result = await lbs.getLightBridgeAddress({ chainId })
      expect(result.lightBridgeAddress).toBe('L2_TELEPORTATION')
      expect(result.destChainConfig).toBe(MOCK_CHAIN_LIST[chainId])
    })
    test('should use networkService.chainId if chainId is not provided and L1ORL2 is l1', async () => {
      const chainId = 88
      networkService.chainId = chainId
      networkService.L1orL2 = Layer.L1
      CHAIN_ID_LIST[chainId] = MOCK_CHAIN_LIST[chainId]
      const result = await lbs.getLightBridgeAddress({})
      expect(result.lightBridgeAddress).toBe('L1_TELEPORTATION')
      expect(result.destChainConfig).toBe(MOCK_CHAIN_LIST[chainId])
    })
    test('should use networkService.chainId if chainId is not provided and L1ORL2 is l2', async () => {
      const chainId = 88
      networkService.chainId = chainId
      networkService.L1orL2 = Layer.L2
      CHAIN_ID_LIST[chainId] = MOCK_CHAIN_LIST[chainId]
      const result = await lbs.getLightBridgeAddress({})
      expect(result.lightBridgeAddress).toBe('L2_TELEPORTATION')
      expect(result.destChainConfig).toBe(MOCK_CHAIN_LIST[chainId])
    })

    test('should throw an error for an unknown network', async () => {
      const chainId = 89
      networkService.chainId = chainId
      networkService.L1orL2 = Layer.L2
      CHAIN_ID_LIST[chainId] = MOCK_CHAIN_LIST[chainId]
      const result = await lbs.getLightBridgeAddress({})
      expect(result.lightBridgeAddress).toBeNull()
      expect(result.destChainConfig).toBeNull()
    })

    test('should handle chainId not provided and networkService.chainId is invalid', async () => {
      const result = await lbs.getLightBridgeAddress({})
      expect(result.lightBridgeAddress).toBeNull()
      expect(result.destChainConfig).toBeNull()
    })

    test('should handle exceptions thrown by fetchAddresses', async () => {
      const chainId = 89
      networkService.chainId = chainId
      networkService.L1orL2 = Layer.L2
      CHAIN_ID_LIST[chainId] = MOCK_CHAIN_LIST[chainId]
      jest.spyOn(appService, 'fetchAddresses').mockImplementation(() => {
        throw new Error(`fetch error`)
      })
      const result = await lbs.getLightBridgeAddress({})
      expect(result.lightBridgeAddress).toBeNull()
      expect(result.destChainConfig).toBeNull()
    })
  })

  describe('GetLightBridgeContract', () => {
    beforeEach(() => {
      jest.spyOn(lbs, 'getLightBridgeAddress').mockResolvedValue({
        lightBridgeAddress: addresses.Proxy__L1Teleportation,
        destChainConfig: MOCK_CHAIN_LIST[99],
      })
    })

    it('Should return null light bridge address is null', async () => {
      jest.spyOn(lbs, 'getLightBridgeAddress').mockResolvedValue({
        lightBridgeAddress: null,
        destChainConfig: null,
      })

      const result = await lbs.getLightBridgeContract(99)
      expect(result).toBeNull()
    })

    it('Should return contract correctly with rpc and provider', async () => {
      const result = await lbs.getLightBridgeContract(99)
      expect(result?.provider['connection']).toEqual({
        url: 'https://sepolia.boba.network',
      })
      expect(result?.address).toEqual(addresses.Proxy__L1Teleportation)
      expect(result).not.toBeNull()
    })
  })
})
