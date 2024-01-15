import teleportationService from './teleportation.service'
import networkService from 'services/networkService'

jest.mock('services/networkService', () => {
  return {
    chainId: jest.fn(),
    getBalances: jest.fn(),
    networkConfig: {
      L1: {
        chainId: 1,
      },
    },
  }
})

const consoleErrorSpy = jest.spyOn(console, 'error')

describe('Teleportation Service', () => {
  test('getTeleportationAddress Should return network settings based on chain ID ', async () => {
    const result = teleportationService.getTeleportationAddress(1)
    expect(result).toEqual({
      networkConfig: {
        chain: 'ETHEREUM',
        icon: 'ethereum',
        imgSrc: 'ethereum.svg',
        layer: 'L1',
        name: 'Ethereum',
        networkType: 'Mainnet',
        siteName: 'Ethereum',
      },
      teleportationAddr: undefined,
    })
  })
  test('getTeleportationAddress Should return null if chainId is not supported ', async () => {
    const result = teleportationService.getTeleportationAddress(107) //unsuported chain id
    expect(result).toEqual({
      networkConfig: null,
      teleportationAddr: null,
    })
  })
  test('getTeleportationAddress Should return null if chainId is not defined ', async () => {
    const result = teleportationService.getTeleportationAddress() //unsuported chain id
    expect(result).toEqual({
      networkConfig: null,
      teleportationAddr: null,
    })
  })
  test('getTeleportationContract Should return null if ChanId is not supported ', async () => {
    const result = teleportationService.getTeleportationContract(0) // not valid chain address
    expect(result).toEqual(undefined)
  })

  test('getTeleportationContract Should return null if ChanId issupported ', async () => {
    const result = teleportationService.getTeleportationContract(1) // not valid chain address
    expect(result).toEqual(undefined)
  })
})
