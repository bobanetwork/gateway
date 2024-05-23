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
        cy.get('[data-testid="settings-modal"]').should('be.visible')
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

      it('should close modal on click of close icon', () => {
        cy.get('[data-testid="close-modal-settings-modal"]')
          .should('be.visible')
          .click()

        cy.get('[data-testid="settings-modal"]').should('not.exist')
      })
    })

    describe('Bridge Type', () => {
      it('should update state on click', () => {
        let value = getBridgeStoreValue('bridgeType')
        value.should('equal', 'CLASSIC')

        cy.get('[data-testid="light-btn"]').click()
        value = getBridgeStoreValue('bridgeType')
        value.should('equal', 'LIGHT')

        cy.get('[data-testid="third-party-btn"]').click()
        value = getBridgeStoreValue('bridgeType')
        value.should('equal', 'THIRD_PARTY')

        cy.get('[data-testid="classic-btn"]').click()
        value = getBridgeStoreValue('bridgeType')
        value.should('equal', 'CLASSIC')
      })
      describe('Classic', () => {
        it('should have correct list of network in form network option', () => {
          // check form network.
          cy.get('[data-testid="from-network-picker"]')
            .should('be.visible')
            .click()

          cy.get('[data-testid="network-picker-modal"]')
            .should('exist')
            .should('be.visible')

          cy.get('[data-testid="network-picker-modal"] h2').should(
            'contain',
            'Select Network'
          )

          cy.get('.networkItem')
            .should('have.length', 2)
            .and((networkItem) => {
              expect(networkItem).to.have.length(2)

              const labels = networkItem.map((i, el) => {
                return Cypress.$(el).text()
              })

              expect(labels.get()).to.deep.eq([
                'Ethereum',
                'Binance Smart Chain',
              ])
            })

          cy.get('[data-testid="close-modal-network-picker-modal"]')
            .should('be.visible')
            .click()
        })
        it('should have correct list of network in to network option', () => {
          // check to network.
          cy.get('[data-testid="to-network-picker"]')
            .should('be.visible')
            .click()

          cy.get('[data-testid="network-picker-modal"]')
            .should('exist')
            .should('be.visible')

          cy.get('[data-testid="network-picker-modal"] h2').should(
            'contain',
            'Select Network'
          )

          cy.get('.networkItem')
            .should('have.length', 2)
            .and((networkItem) => {
              expect(networkItem).to.have.length(2)

              const labels = networkItem.map((i, el) => {
                return Cypress.$(el).text()
              })

              expect(labels.get()).to.deep.eq(['Boba ETH', 'Boba BNB'])
            })
          cy.get('[data-testid="close-modal-network-picker-modal"]')
            .should('be.visible')
            .click()
        })
      })
      describe('Light', () => {
        before(() => {
          cy.get('[data-testid="light-btn"]').click()
        })
        it('should have correct list of network in form network option', () => {
          // check from network.
          cy.get('[data-testid="from-network-picker"]')
            .should('be.visible')
            .click()

          cy.get('[data-testid="network-picker-modal"]')
            .should('exist')
            .should('be.visible')

          cy.get('[data-testid="network-picker-modal"] h2').should(
            'contain',
            'Select Network'
          )

          cy.get('.networkItem')
            .should('have.length', 6)
            .and((networkItem) => {
              expect(networkItem).to.have.length(6)

              const labels = networkItem.map((i, el) => {
                return Cypress.$(el).text()
              })

              expect(labels.get()).to.deep.eq([
                'Ethereum',
                'Boba ETH',
                'Binance Smart Chain',
                'Boba BNB',
                'Optimism',
                'Arbitrum',
              ])
            })

          cy.get('[data-testid="close-modal-network-picker-modal"]')
            .should('be.visible')
            .click()
        })
        it('should have correct list of network in to network option', () => {
          // check to network.
          cy.get('[data-testid="to-network-picker"]')
            .should('be.visible')
            .click()

          cy.get('[data-testid="network-picker-modal"]')
            .should('exist')
            .should('be.visible')

          cy.get('[data-testid="network-picker-modal"] h2').should(
            'contain',
            'Select Network'
          )

          cy.get('.networkItem')
            .should('have.length', 5)
            .and((networkItem) => {
              expect(networkItem).to.have.length(5)

              const labels = networkItem.map((i, el) => {
                return Cypress.$(el).text()
              })

              expect(labels.get()).to.deep.eq([
                'Boba ETH',
                'Boba BNB',
                'Binance Smart Chain',
                'Optimism',
                'Arbitrum',
              ])
            })

          cy.get('[data-testid="close-modal-network-picker-modal"]')
            .should('be.visible')
            .click()
        })
      })
      describe('Third Party', () => {
        before(() => {
          cy.get('[data-testid="third-party-btn"]').click()
        })
        it('should have show correct list of 3rd party bridge', () => {
          cy.contains('Third party bridges').should('be.visible')
          cy.get('a[data-testid="bridge-item"]')
            .should('not.be.empty')
            .and((bridgeItems) => {
              expect(bridgeItems).to.have.length(2)

              const links = bridgeItems.map((i, el) => {
                return Cypress.$(el).attr('href')
              })

              expect(links.get()).to.deep.eq([
                'https://boba.banxa.com/',
                'https://app.symbiosis.finance/swap?chainIn=Ethereum&chainOut=Boba%20Ethereum&tokenIn=ETH&tokenOut=ETH',
              ])

              const labels = bridgeItems.map((i, el) => {
                return Cypress.$(el).text()
              })

              expect(labels.get()).to.deep.eq(['Banxa', 'Symbiosis'])
            })
        })
      })
    })
  })
})
