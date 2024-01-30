/// <reference types="cypress" / >
import { chromium } from '@playwright/test'
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overswrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }

// }
Cypress.Commands.add('removePreviouslyAddedNetworks', async () => {
  cy.task('switchToMetamaskWindow')
  // as of now I'm not able to operate on the metamask extension :/
  const debuggerDetails = await fetch('http://127.0.0.1:9222/json/version') //DevSkim: ignore DS137138
  const debuggerDetailsConfig = await debuggerDetails.json()
  const webSocketDebuggerUrl = debuggerDetailsConfig.webSocketDebuggerUrl
  const browser = await chromium.connectOverCDP(webSocketDebuggerUrl)
  assert(browser.isConnected())

  cy.window().find('[data-testid="network-display"]').should('exist').click()

  // get the list of networks
  // filter out networks that cannot be deleted
  // hover over each network that can be deleted
  // click the delete option
  cy.window()
    .find('div.network-dropdown-list')
    .filter((i, element) => {
      const networkNameContainer =
        element.getElementsByClassName('network-name-item')[0]
      const networkName = networkNameContainer.textContent
      if (
        networkName === 'Ethereum Mainnet' ||
        networkName === 'Goerli test network' ||
        networkName === 'Sepolia test network'
      ) {
        return false
      }
      return true
    })
    .each(($networkItem) => {
      cy.wrap($networkItem)
        .find('.fa-times delete')
        .should('exist')
        .trigger('mouseover')
        .click({ force: true })
      cy.get('.modal').find('button').contains('Delete').should('exist').click()
    })
})
