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
  it('Should add Boba Token to Metamask Wallet', () => {
    bridge.addTokenWithTokenPicker('BOBA')
    bridge.closeModal('token-picker-modal')
  })
  it('Should select Boba token', () => {
    bridge.selectToken('BOBA')
  })
  after(() => {
    bridge.switchToMainnet()
  })
})
