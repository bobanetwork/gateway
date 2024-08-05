import { CHAIN_ID_LIST, getRpcUrl } from 'util/network/network.util'
import appService, { L1_ETH_Address, L2_BOBA_Address } from '../app.service'
import { MOCK_CHAIN_LIST } from '../mock/teleporation'
import { lightBridgeService as lbs } from './teleportation.service'
import networkService from '../networkService'
import { LAYER, Layer } from 'util/constant'
import { constants, Contract, providers } from 'ethers'
import { L1ERC20ABI, L2StandardERC20ABI, TeleportationABI } from 'services/abi'
import { getDestinationTokenAddress } from '@bobanetwork/light-bridge-chains'

jest.mock('../../util/network/network.util', () => {
  const originalModule = jest.requireActual('../../util/network/network.util')
  return {
    ...originalModule,
    getRpcUrl: jest.fn(),
    getRpcUrlByChainId: jest.fn(),
  }
})
jest.mock('@bobanetwork/light-bridge-chains', () => ({
  getDestinationTokenAddress: jest.fn(),
}))
jest.mock('../networkService')
jest.mock('../app.service')
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
      StaticJsonRpcProvider: jest.fn().mockReturnValue({
        getSigner: jest.fn(),
      }),
    },
  }
})

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
      CHAIN_ID_LIST[chainId] = {
        ...MOCK_CHAIN_LIST[chainId],
        layer: LAYER.L2,
      }
      const result = await lbs.getLightBridgeAddress({ chainId })
      expect(result.lightBridgeAddress).toBe('L2_TELEPORTATION')
      expect(result.destChainConfig).toBe(CHAIN_ID_LIST[chainId])
    })

    test('should return destChainConfig as null in case missmatch layer', async () => {
      const chainId = 99
      CHAIN_ID_LIST[chainId] = {
        ...MOCK_CHAIN_LIST[chainId],
        layer: 'l3',
      }
      const result = await lbs.getLightBridgeAddress({ chainId })
      expect(result.lightBridgeAddress).toBeUndefined()
      expect(result.destChainConfig).toBe(CHAIN_ID_LIST[chainId])
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
    test('should use networkService.chainId if chainId is not provided and L1ORL2 is l1', async () => {
      const chainId = 88
      networkService.chainId = chainId
      networkService.L1orL2 = Layer.L1
      CHAIN_ID_LIST[chainId] = MOCK_CHAIN_LIST[chainId]
      const result = await lbs.getLightBridgeAddress()
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
    let mockSigner
    beforeEach(() => {
      jest.spyOn(lbs, 'getLightBridgeAddress').mockResolvedValue({
        lightBridgeAddress: addresses.Proxy__L1Teleportation,
        destChainConfig: MOCK_CHAIN_LIST[99],
      })
      mockSigner = jest.fn()
      ;(
        providers.StaticJsonRpcProvider as unknown as jest.Mock
      ).mockReturnValue({
        getSigner: mockSigner,
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

    it('Should return contract when the address is found', async () => {
      const cMock = {
        address: addresses.Proxy__L1Teleportation,
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(cMock)
      const result = await lbs.getLightBridgeContract(99)
      expect(result).not.toBeNull()
      expect(result).toBe(cMock)
      expect(getRpcUrl).toHaveBeenCalledWith({
        layer: 'L2',
        network: 'ETHEREUM',
        networkType: 'Testnet',
      })
      expect(Contract).toHaveBeenCalledWith(
        'L1_TELEPORTATION',
        TeleportationABI,
        {
          getSigner: mockSigner,
        }
      )
    })
  })

  describe('isTokenSupported', () => {
    let contractMock: any
    let getSignerMock: any
    const layer = Layer.L1
    let tokenAdress = '0xValidTokenAddress'
    const destChainId = '1'
    beforeEach(() => {
      getSignerMock = jest.fn().mockReturnValue({})
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })
      contractMock = {
        supportedTokens: jest.fn().mockResolvedValue({ supported: true }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      networkService.addresses = {
        Proxy__L1Teleportation: 'lightBridgeAddressL1',
        Proxy__L2Teleportation: 'lightBridgeAddressL2',
      }
    })
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return supported status for L2 layer with valid token address', async () => {
      const result = await lbs.isTokenSupported({
        layer,
        tokenAdress,
        destChainId,
      })
      expect(result).toEqual({ supported: true })
    })

    it('should return supported status for L1 layer with valid token address', async () => {
      const result = await lbs.isTokenSupported({
        layer: 'L2',
        tokenAdress,
        destChainId,
      })
      expect(Contract).toHaveBeenCalledWith(
        'lightBridgeAddressL2',
        TeleportationABI,
        {}
      )
      expect(result).toEqual({ supported: true })
    })

    it('should replace specific token address with AddressZero and return supported status', async () => {
      tokenAdress = '0x4200000000000000000000000000000000000006'

      const result = await lbs.isTokenSupported({
        layer,
        tokenAdress,
        destChainId,
      })
      expect(result).toEqual({ supported: true })
    })

    it('should throw an error if lightBridgeAddress is invalid and supported to be false', async () => {
      networkService.addresses = { Proxy__L1Teleportation: undefined }
      const result = await lbs.isTokenSupported({
        layer,
        tokenAdress,
        destChainId,
      })
      expect(result).toEqual({ supported: false })
    })

    it('should catch and return supported as false on contract call fails', async () => {
      const error = new Error('Failed invoke contract')
      contractMock.supportedTokens.mockResolvedValue(error)
      const result = await lbs.isTokenSupported({
        layer,
        tokenAdress,
        destChainId,
      })

      expect(result).toEqual(error)
    })
  })

  describe('getDisburserBalance', () => {
    let contractMock: any
    let getSignerMock: any
    let getBalanceMock: any
    const l2ETHAddress = 'l2ETHAddress'
    const destAddress = '0xDestAddress'
    const destChainId = '1'
    const sourceChainId = '9'
    const tokenAddress = '0xTokenAddress'
    beforeEach(() => {
      getSignerMock = jest.fn().mockReturnValue({})
      getBalanceMock = jest.fn().mockReturnValue(10)
      ;(
        providers.StaticJsonRpcProvider as unknown as jest.Mock
      ).mockReturnValue({
        getSigner: getSignerMock,
        getBalance: getBalanceMock,
      })
      contractMock = {
        balanceOf: jest.fn().mockResolvedValue(20),
        disburser: jest.fn().mockResolvedValue('0xdisburser'),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      networkService.addresses = {
        L2_ETH_ADDRESS: l2ETHAddress,
      }
      ;(getDestinationTokenAddress as unknown as jest.Mock).mockReturnValue(
        destAddress
      )
      jest.spyOn(lbs, 'getLightBridgeContract').mockResolvedValue(contractMock)
    })
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return correct balance for L1 with correct contract invokation ', async () => {
      networkService.L1orL2 = 'L1'
      const result = await lbs.getDisburserBalance({
        destChainId,
        sourceChainId,
        tokenAddress,
      })
      expect(Contract).toHaveBeenCalledWith(destAddress, L2StandardERC20ABI, {
        getSigner: getSignerMock,
        getBalance: getBalanceMock,
      })
      expect(result).toBe(20)
    })

    it('should return correct balance for L2 with correct contract invokation ', async () => {
      networkService.L1orL2 = 'L2'
      const result = await lbs.getDisburserBalance({
        destChainId,
        sourceChainId,
        tokenAddress,
      })
      expect(Contract).toHaveBeenCalledWith(destAddress, L1ERC20ABI, {
        getSigner: getSignerMock,
        getBalance: getBalanceMock,
      })
      expect(result).toBe(20)
    })

    it('should return correct balance for L1 incase of native token', async () => {
      networkService.L1orL2 = 'L2'
      ;(getDestinationTokenAddress as unknown as jest.Mock).mockReturnValue(
        constants.AddressZero
      )
      const result = await lbs.getDisburserBalance({
        destChainId,
        sourceChainId,
        tokenAddress,
      })
      expect(getBalanceMock).toHaveBeenCalledWith('0xdisburser')
      expect(result).toBe(10)
    })

    it('should return 0 incase of invalid lightBridgeContract', async () => {
      networkService.L1orL2 = 'L2'
      jest.spyOn(lbs, 'getLightBridgeContract').mockResolvedValue(null)

      const result = await lbs.getDisburserBalance({
        destChainId,
        sourceChainId,
        tokenAddress,
      })
      expect(result).toBe(0)
    })
    it('should return 0 incase of invalid disburser address', async () => {
      networkService.L1orL2 = 'L2'
      contractMock.disburser.mockResolvedValue(null)
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      const result = await lbs.getDisburserBalance({
        destChainId,
        sourceChainId,
        tokenAddress,
      })
      expect(result).toBe(0)
    })
    it('should change token address to L1ETH in case of L2 Boba Address', async () => {
      networkService.L1orL2 = 'L2'

      const result = await lbs.getDisburserBalance({
        destChainId,
        sourceChainId,
        tokenAddress: L2_BOBA_Address,
      })

      expect(getDestinationTokenAddress).toHaveBeenCalled()
      expect(getDestinationTokenAddress).toHaveBeenCalledWith(
        L1_ETH_Address,
        sourceChainId,
        destChainId
      )

      expect(result).toBe(20)
    })
  })

  describe('deposit', () => {
    let contractMock: any
    let getSignerMock: any
    let tokenAddress = '0xNativeTokenAddress'
    const lightBridgeAddress = '0xL2ProxyAddress'
    const value = '1000'
    const destChainId = 123
    let layer = 'L1'

    beforeEach(() => {
      getSignerMock = jest.fn().mockReturnValue({})
      ;(providers.JsonRpcProvider as unknown as jest.Mock).mockReturnValue({
        getSigner: getSignerMock,
      })
      contractMock = {
        supportedTokens: jest.fn().mockResolvedValue({ supported: true }),
        teleportAsset: jest.fn().mockResolvedValue({ wait: jest.fn() }),
      }
      ;(Contract as unknown as jest.Mock).mockReturnValue(contractMock)
      ;(networkService as any).provider = new providers.JsonRpcProvider(
        'http://demo.local'
      )

      networkService.addresses = {
        Proxy__L1Teleportation: lightBridgeAddress,
        L1_ETH_Address: tokenAddress,
        NETWORK_NATIVE_TOKEN: tokenAddress,
      }
    })
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should deposit correctly L1 -> L2 with NETWORK_NATIVE_TOKEN', async () => {
      const txMock = { wait: jest.fn() }

      contractMock.teleportAsset.mockResolvedValue(txMock)

      const result = await lbs.deposit({
        layer,
        tokenAddress,
        value,
        destChainId,
      })

      expect(result).toBe(true)
      expect(txMock.wait).toHaveBeenCalled()
      expect(contractMock.supportedTokens).toHaveBeenCalledWith(
        constants.AddressZero,
        destChainId
      )
      expect(contractMock.teleportAsset).toHaveBeenCalledWith(
        constants.AddressZero,
        value,
        destChainId,
        { value }
      )
    })

    it('should deposit correctly L1 -> L2 with L1_ETH_ADDRESS', async () => {
      const txMock = { wait: jest.fn() }
      networkService.addresses.L1_ETH_Address = L1_ETH_Address

      contractMock.teleportAsset.mockResolvedValue(txMock)

      const result = await lbs.deposit({
        layer,
        tokenAddress: L1_ETH_Address,
        value,
        destChainId,
      })

      expect(result).toBe(true)
      expect(txMock.wait).toHaveBeenCalled()
      expect(contractMock.supportedTokens).toHaveBeenCalledWith(
        constants.AddressZero,
        destChainId
      )
      expect(contractMock.teleportAsset).toHaveBeenCalledWith(
        constants.AddressZero,
        value,
        destChainId,
        { value }
      )
    })

    it('should deposit correctly L1 -> L2 with Different Token', async () => {
      layer = 'L2'
      tokenAddress = 'tokenAddress'

      networkService.addresses = {
        ...networkService.addresses,
        NETWORK_NATIVE_TOKEN: 'BOBA',
      }

      const txMock = { wait: jest.fn() }

      contractMock.teleportAsset.mockResolvedValue(txMock)

      const result = await lbs.deposit({
        layer,
        tokenAddress,
        value,
        destChainId,
      })

      expect(result).toBe(true)
      expect(txMock.wait).toHaveBeenCalled()
      expect(contractMock.supportedTokens).toHaveBeenCalledWith(
        tokenAddress,
        destChainId
      )
      expect(contractMock.teleportAsset).toHaveBeenCalledWith(
        tokenAddress,
        value,
        destChainId,
        {}
      )
    })

    it('should handle unsupported token error', async () => {
      networkService.addresses = {
        ...networkService.addresses,
        NETWORK_NATIVE_TOKEN: 'BOBA',
      }
      contractMock.supportedTokens.mockResolvedValue({ supported: false })

      const result = await lbs.deposit({
        layer,
        tokenAddress,
        value,
        destChainId,
      })
      const error = new Error(
        `GATEWAY ERROR: Asset ${tokenAddress} not supported for chain ${destChainId}`
      )
      expect(result).toEqual(error)
    })

    it('should handle deposit transaction error', async () => {
      const error = new Error('Invalid txs!')

      contractMock.teleportAsset.mockRejectedValue(error)

      const result = await lbs.deposit({
        layer,
        tokenAddress,
        value,
        destChainId,
      })

      expect(result).toEqual(error)
    })
  })
})
