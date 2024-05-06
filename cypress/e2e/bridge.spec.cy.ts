import { getBridgeStoreValue, getNetworkStoreValue } from './helpers/redux'

describe('Bridge Page', () => {
  before(() => {
    cy.visit('/bridge')
  })

  describe('Bridge view', () => {
    it('Should have correct title and load tooltip with expected conntent on hover.', () => {
      const titleText = 'Bridge' // Expected title text
      const cbTitle = 'Classic Bridge'
      const cbDesc =
        'Although this option is always available, it takes 7 days to receive your funds when withdrawing from L2 to L1.'
      const lbTitle = 'Light Bridge'
      const lbDesc =
        'Bridge is an easy, fast, and cheap bridging solution that quickly gets your funds to your destination chain only available for a few selected assets (BOBA, ETH, BNB).'

      cy.get('#bridge h2').should('contain', titleText)

      cy.get('[data-testid="tooltip-btn"]').trigger('mouseover')

      cy.get('.MuiTooltip-popper').should('be.visible')

      // check classic bridge content
      cy.get('[data-testid="tooltip-cb-t"]').should('contain', cbTitle)
      cy.get('[data-testid="tooltip-cb-d"]').should('contain', cbDesc)
      // check classic light content
      cy.get('[data-testid="tooltip-lb-t"]').should('contain', lbTitle)
      cy.get('[data-testid="tooltip-lb-d"]').should('contain', lbDesc)

      cy.get('[data-testid="tooltip-btn"]').trigger('mouseout')
    })

    describe('Settings Modal', () => {
      it('Should display correct switch labels and descriptions', () => {
        cy.get('[data-testid="setting-btn"]').should('exist').click()
        // Check the first setting item
        cy.get('.setting-item')
          .eq(0)
          .within(() => {
            cy.get('[data-testid="item-title"]').should(
              'contain',
              'Show Testnets'
            )
            cy.get('[data-testid="item-desc"]').should(
              'contain',
              'Testnets will be available to bridge'
            )
          })

        // Check the second setting item
        cy.get('.setting-item')
          .eq(1)
          .within(() => {
            cy.get('[data-testid="item-title"]').should(
              'contain',
              'Add Destination Address'
            )
            cy.get('[data-testid="item-desc"]').should(
              'contain',
              'Allows you to transfer to a different address'
            )
          })
      })

      it('Should toggle switches correctly & updates redux state', () => {
        // Toggle the first switch
        // Verify that the switch is toggled & store has been update.
        const value = getNetworkStoreValue('activeNetworkType')
        value.should('equal', 'Mainnet')
        cy.get('.setting-item')
          .eq(0)
          .find('[data-testid="switch-label"]')
          .click()
        const newValue = getNetworkStoreValue('activeNetworkType')
        newValue.should('equal', 'Testnet')
        cy.get('.setting-item')
          .eq(0)
          .find('input[type="checkbox"]')
          .should('be.checked')
        cy.get('.setting-item')
          .eq(0)
          .find('[data-testid="switch-label"]')
          .click()

        // Toggle the second switch
        const toAddress = getBridgeStoreValue('bridgeToAddressState')
        toAddress.should('equal', false)
        cy.get('.setting-item')
          .eq(1)
          .find('[data-testid="switch-label"]')
          .click()
        const newToAddress = getBridgeStoreValue('bridgeToAddressState')
        newToAddress.should('equal', true)
        cy.get('.setting-item')
          .eq(1)
          .find('input[type="checkbox"]')
          .should('be.checked')
        cy.get('.setting-item')
          .eq(1)
          .find('[data-testid="switch-label"]')
          .click()
      })
    })
  })
})
