import walletService from './wallet.service'
import { providers, Contract } from 'ethers'
import { LAYER } from 'util/constant'
const ACCOUNT_ADDRESS = '0xcF044AB1e5b55203dC258F47756daFb7F8F01760'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import teleportationService from './teleportation.service'
import networkService from './networkService'
const mockOn = jest.fn()
const mockConnect = jest.fn()
const mockEnable = jest.fn()
const mockRequest = jest.fn()
const mockDisconnect = jest.fn().mockResolvedValue(true)

jest.mock('@walletconnect/ethereum-provider', () => {
  return {
    EthereumProvider: {
      init: jest.fn(),
    },
  }
})

jest.mock('ethers', () => {
  const actualEthers = jest.requireActual('ethers')
  return {
    ...actualEthers,
    ethers: {
      ...actualEthers.ethers,
      providers: {
        ...actualEthers.ethers.providers,
        Web3Provider: jest.fn().mockImplementation(() => ({
          getNetwork: jest.fn().mockResolvedValue({ chainId: '5' }),
          getSigner: jest.fn().mockImplementation(() => ({
            getAddress: jest.fn().mockResolvedValue(ACCOUNT_ADDRESS),
          })),
        })),
        JsonRpcProvider: jest.fn().mockImplementation(() => {
          return {
            getTransactionCount: jest.fn().mockImplementation(() => {
              return 1
            }),
            getGasPrice: jest.fn().mockImplementation(() => {
              return 1
            }),
          }
        }),
      },
      Contract: jest.fn().mockImplementation(() => ({
        attach: jest.fn().mockReturnThis(),
        supportedTokens: jest.fn().mockResolvedValue({ supported: true }),
        teleportAsset: jest.fn().mockResolvedValue({
          wait: jest.fn().mockResolvedValue({}),
        }),
        connect: jest.fn(() => ({
          withdrawLiquidity: jest.fn(),
        })),
      })),
    },
  }
})

const mockTeleportationContract = {
  initialize: jest.fn(),
  owner: jest.fn().mockResolvedValue(ACCOUNT_ADDRESS),
  supportedTokens: jest.fn().mockResolvedValue({
    supported: true,
    minDepositAmount: 0,
    maxDepositAmount: 1000,
    maxTransferAmountPerDay: 5000,
    transferredAmount: 100,
    transferTimestampCheckPoint: 1625097600,
  }),
  teleportAsset: jest.fn().mockResolvedValue({
    wait: jest.fn().mockResolvedValue({}),
  }),
}

jest.mock('services/networkService', async () => {
  return {
    ...jest.requireActual('./networkService'),
    getAllAddresses: jest.fn(),
    teleportationAddr: '0x84b22166366a6f7E0cD0c3ce9998f2913Bf17A13',
    addresses: {
      Proxy__L1Teleportation: '0xeCCD355862591CBB4bB7E7dD55072070ee3d0fC1',
      Proxy__L2Teleportation: '0x4200000000000000000000000000000000000023',
    },
    chainIds: { L1: '5', L2: '2888' },
    networkConfig: {
      L1: {
        chainId: 5,
      },
      L2: {
        chainId: 2888,
      },
    },
    Teleportation: {
      attach: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockImplementation(() => mockTeleportationContract),
      })),
    },
  }
})

jest.mock('./wallet.service', () => {
  return {
    provider: {
      getSigner: jest.fn().mockImplementation(() => ({
        getAddress: jest.fn().mockResolvedValue(ACCOUNT_ADDRESS),
      })),
      getBlock: jest.fn(),
    },
  }
})

jest.mock('store', () => {
  return {
    dispatch: jest.fn(),
  }
})

jest.mock('@bobanetwork/sdk', () => {
  return {
    CrossChainMessenger: jest.fn(),
  }
})

describe('Teleportation Service', () => {
  const wsInstance = walletService
  let ethereumMock: any
  let spyLog: any
  const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {
      return
    })
  spyLog = jest.spyOn(console, 'error').mockImplementation(() => {
    return
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  afterAll(() => {
    jest.restoreAllMocks()
  })
  beforeEach(() => {
    spyLog = jest.spyOn(console, 'error').mockImplementation(() => {
      return
    })
    ethereumMock = {
      request: jest.fn(),
      on: jest.fn(),
    }
    ;(global as any).window.ethereum = ethereumMock
    // @ts-ignore
  })

  test('getTeleportationAddress Should return network settings based on chain ID and teleportationAddr undefined on L1', async () => {
    const result = teleportationService.getTeleportationAddress(1)
    expect(result).toEqual({
      networkConfig: {
        chain: 'ETHEREUM',
        icon: 'ethereum',
        imgSrc: 'ethereum.svg',
        layer: LAYER.L1,
        name: 'Ethereum',
        networkType: 'Mainnet',
        siteName: 'Ethereum',
      },
      teleportationAddr: undefined,
    })
  })
  test('getTeleportationAddress Should return network settings based on chain ID and teleportationAddr undefined on L2', async () => {
    const result = teleportationService.getTeleportationAddress(288)
    expect(result).toEqual({
      networkConfig: {
        chain: 'ETHEREUM',
        icon: 'ethereum',
        imgSrc: 'bobaEth.svg',
        layer: LAYER.L2,
        name: 'Boba Eth',
        networkType: 'Mainnet',
        siteName: 'Boba ETH',
      },
      teleportationAddr: undefined,
    })
  })
  test('getTeleportationAddress Should return network settings and teleportationAddr defined on valid Network on L1', async () => {
    const result = teleportationService.getTeleportationAddress(5)
    expect(result).toEqual({
      networkConfig: {
        chain: 'ETHEREUM',
        icon: 'ethereum',
        imgSrc: 'ethereum.svg',
        layer: LAYER.L1,
        name: 'Goerli',
        networkType: 'Testnet',
        siteName: 'Ethereum (Goerli)',
      },
      teleportationAddr: '0x84b22166366a6f7E0cD0c3ce9998f2913Bf17A13',
    })
  })
  test('getTeleportationAddress Should return network settings and teleportationAddr defined on valid Network on L2', async () => {
    const result = teleportationService.getTeleportationAddress(2888)
    expect(result).toEqual({
      networkConfig: {
        chain: 'ETHEREUM',
        icon: 'ethereum',
        imgSrc: 'bobaEth.svg',
        layer: LAYER.L2,
        name: 'Boba Goerli',
        networkType: 'Testnet',
        siteName: 'Boba (Goerli)',
      },
      teleportationAddr: '0xB43EE846Aa266228FeABaD1191D6cB2eD9808894',
    })
  })
  test('getTeleportationAddress Should return null if chainId is not supported and teleportationAddr undefined', async () => {
    const result = teleportationService.getTeleportationAddress(107) //unsuported chain id
    expect(result).toEqual({
      networkConfig: null,
      teleportationAddr: null,
    })
  })
  test('getTeleportationAddress Should return chainId as Default if chainId is not defined and teleportationAddr undefined ', async () => {
    const result = teleportationService.getTeleportationAddress() //unsuported chain id
    expect(result).toEqual({
      networkConfig: null,
      teleportationAddr: null,
    })
  })

  test('getTeleportationContract should return provider  ', async () => {
    const testChain = 2888

    const result = teleportationService.getTeleportationContract(testChain)

    expect(result).toEqual(undefined)
  })
})
