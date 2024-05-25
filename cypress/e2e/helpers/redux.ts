export const getReduxStore = () => {
  return cy.window().its('store').invoke('getState')
}

export const verifyReduxStoreSetup = (attribute, expectedValue) => {
  getReduxStore().its('setup').its(attribute).should(`equal`, expectedValue)
}

export const verifyReduxStoreNetwork = (attribute, expectedValue) => {
  getReduxStore().its('network').its(attribute).should('equal', expectedValue)
}

export const getNetworkStoreValue = (attribute) => {
  return getReduxStore().its('network').its(attribute)
}

export const verifyReduxStoreBalance = (attribute, expectedValue) => {
  getReduxStore().its('balance').its(attribute).should('equal', expectedValue)
}

export const verifyReduxUiState = (attribute, expectedValue) => {
  getReduxStore()
    .its('ui')
    .its(attribute)
    .should('exist')
    .should('equal', expectedValue)
}

export const verifyReduxStateNotEmpty = (type, name) => {
  getReduxStore().its(type).its(name).should('not.be.empty')
}

export const verifyReduxStoreBridge = (attribute, expectedValue) => {
  getReduxStore()
    .its('bridge')
    .its(attribute)
    .should('exist')
    .should('equal', expectedValue)
}

export const getBridgeStoreValue = (attribute) => {
  return getReduxStore().its('bridge').its(attribute)
}

export const allowBaseEnabledToUpdate = (accountConnected) => {
  if (!accountConnected) {
    verifyReduxStoreSetup('baseEnabled', false)
    verifyReduxStoreSetup('baseEnabled', true)
  }
}

export const verifyTokenSelected = (tokenSymbol) => {
  getReduxStore()
    .its('bridge')
    .its('tokens')
    .its(0)
    .should('exist')
    .its('symbol')
    .should('equal', tokenSymbol)
}
