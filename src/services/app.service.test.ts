import appService from './app.service'
import { Network, NetworkType } from '../util/network/network.util'
import { isAnchorageEnabled } from '../util/constant'

describe('App Service', () => {
  const SepoliaAddressManager = '0xC62C429390B7bCE9960fa647d5556CA7238168AB'
  const origEnv = process.env

  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    process.env = origEnv // Restore old environment
  })

  describe('Chain Configuration', () => {
    it('should map the correct Sepolia addresses configuration based on anchorage env', () => {
      process.env = {
        ...origEnv,
        REACT_APP_ENABLE_ANCHORAGE: 'true',
      }

      const config = appService.fetchAddresses({
        networkType: NetworkType.TESTNET,
        network: Network.ETHEREUM,
      })

      expect(isAnchorageEnabled(NetworkType.TESTNET)).toEqual(true)
      expect(config.AddressManager).toEqual(SepoliaAddressManager)
      expect(config.L1StandardBridgeProxy).toEqual(
        '0x244d7b81EE3949788Da5F1178D911e83bA24E157'
      )
      expect(config.OptimismPortalProxy).toEqual(
        '0xB079E6FA9B3eb072fEbf7F746044834eab308dB6'
      )
      expect(config.L1StandardBridgeProxy).toEqual(
        '0x244d7b81EE3949788Da5F1178D911e83bA24E157'
      )
    })
  })
})
