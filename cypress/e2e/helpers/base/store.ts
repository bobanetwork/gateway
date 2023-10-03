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

  verifyReduxUiState(attribute: string, expectedValue: boolean | string) {
    this.getReduxStore()
      .its('ui')
      .its(attribute)
      .should('exist')
      .should('equal', expectedValue)
  }
}
