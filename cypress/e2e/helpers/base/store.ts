export class ReduxStore {
  getReduxStore() {
    return cy.window().its('store').invoke('getState')
  }

  verifyReduxStoreSetup(attribute: string, expectedValue: boolean | string) {
    this.getReduxStore()
      .its('setup')
      .its(attribute)
      .should(`equal`, expectedValue)
  }

  verifyReduxStoreNetwork(attribute: string, expectedValue: boolean | string) {
    this.getReduxStore()
      .its('network')
      .its(attribute)
      .should('equal', expectedValue)
  }

  verifyReduxStoreBalance(attribute: string, expectedValue: Number) {
    this.getReduxStore()
      .its('balance')
      .its(attribute)
      .should('equal', expectedValue)
  }

  verifyReduxUiState(attribute: string, expectedValue: boolean | string) {
    this.getReduxStore()
      .its('ui')
      .its(attribute)
      .should('exist')
      .should('equal', expectedValue)
  }

  verifyReduxStateNotEmpty(type, name) {
    this.getReduxStore().its(type).its(name).should('not.be.empty')
  }

  verifyReduxStoreBridge(attribute: string, expectedValue: boolean | string) {
    this.getReduxStore()
      .its('bridge')
      .its(attribute)
      .should('exist')
      .should('equal', expectedValue)
  }

  allowBaseEnabledToUpdate(accountConnected: boolean) {
    if (!accountConnected) {
      this.verifyReduxStoreSetup('baseEnabled', false)
      this.verifyReduxStoreSetup('baseEnabled', true)
    }
  }
  verifyTokenSelected(tokenSymbol: string) {
    this.getReduxStore()
      .its('bridge')
      .its('tokens')
      .its(0)
      .should('exist')
      .its('symbol')
      .should('equal', tokenSymbol)
  }
}
