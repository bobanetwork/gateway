import Page from './base/page'

export default class Stake extends Page {
  constructor() {
    super()
    this.id = 'stake'
    this.walletConnectButtonText = 'Connect Wallet'
    this.title = 'Stake'
  }
}
