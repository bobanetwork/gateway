import { EthereumInfo } from '../../helpers/base/constants'
import Bridge from '../../helpers/bridge'

const bridge = new Bridge()

describe('Token Picker', () => {
  before(() => {
    bridge.visit()
    bridge.isReady()
    bridge.requestMetamaskConnect()
    bridge.verifyAccountConnected()
  })
  it('Should switch to testnet', () => {
    bridge.switchToTestnet()
  })
  it('Should have BOBA token and ETH token in token list', () => {
    bridge.openTokenPicker()
    bridge.verifyTokenInTokenList('ETH')
    bridge.verifyTokenInTokenList('BOBA')
  })
  it('Should select Boba token', () => {
    bridge.selectToken('BOBA')
  })
  after(() => {
    bridge.switchToMainnet(EthereumInfo.networkAbbreviation, false, false)
  })
})
