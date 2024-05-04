import { verifyReduxUiState } from './helpers/redux'

describe('Gateway View', () => {
  before(() => {
    cy.visit('/')
  })

  describe('Gateway Header', () => {
    describe('Navigation', () => {
      it('should validate the href and inner text of navigation links', () => {
        // Define an array of expected links and their corresponding href attributes
        const expectedLinks = [
          { text: 'Bridge', href: '/bridge' },
          { text: 'History', href: '/history' },
          { text: 'Stake', href: '/stake' },
          { text: 'Dao', href: '/dao' },
        ]

        // Get all navigation links and validate their href attributes and inner text
        cy.get('#header > div')
          .find('a')
          .should('not.be.empty')
          .each(($link, index) => {
            cy.wrap($link).should('have.text', expectedLinks[index].text)
            cy.wrap($link).should(
              'have.attr',
              'href',
              expectedLinks[index].href
            )
          })
      })

      it('should navigate to the Bridge page and validate URL', () => {
        cy.get('#header').contains('Bridge').click()
        cy.url().should('include', '/bridge')
      })

      it('should navigate to the History page and validate URL and content', () => {
        cy.get('#header').contains('History').click()

        cy.url().should('include', '/history')

        cy.contains('History').should('be.visible')
        cy.contains('Look back on past transactions').should('be.visible')
      })

      it('should navigate to the Stake page and validate URL and content', () => {
        cy.get('#header').contains('Stake').click()

        cy.url().should('include', '/stake')

        cy.contains('Stake').should('be.visible')
        cy.contains('Stake BOBA and earn rewards.').should('be.visible')
      })

      it('should navigate to the Dao page and validate URL and content', () => {
        cy.get('#header').contains('Dao').click()

        cy.url().should('include', '/dao')

        cy.contains('Dao').should('be.visible')
        cy.contains(
          'Participate in voting on proposals concerning the future of Boba Network'
        ).should('be.visible')
      })
    })

    describe('Theme Switcher', () => {
      it('should switch to light theme when click on the sun icon', () => {
        cy.get('[title="light-icon"]').should('be.visible').click()
        cy.get('[title="light-icon"]').should('not.exist')
        cy.get('[title="dark-icon"]').should('be.visible')
        verifyReduxUiState('theme', 'light')
      })

      it('should switch to dark theme when click on the moon icon', () => {
        cy.get('[title="dark-icon"]').should('be.visible').click()
        cy.get('[title="dark-icon"]').should('not.exist')
        cy.get('[title="light-icon"]').should('be.visible')
        verifyReduxUiState('theme', 'dark')
      })
    })

    describe('Connect wallet button', () => {
      it('should open the modal when clicking on the Connect Wallet button and display available options and close on clicking cross', () => {
        cy.contains('Connect Wallet').click()

        cy.get('[data-testid="walletselector-modal"]').should('be.visible')

        cy.get('[data-testid="metamask-link"]').should('be.visible')

        cy.get('[data-testid="walletconnect-link"]').should('be.visible')

        cy.get('[data-testid="close-modal-walletselector-modal"]')
          .should('be.visible')
          .click()

        cy.get('[data-testid="walletselector-modal"]').should('not.exist')
      })
    })

    describe('Footer', () => {
      describe('FooterLinks', () => {
        it('should contain the correct links', () => {
          const expectedLinks = [
            {
              text: 'FAQs',
              href: 'https://docs.boba.network/faq',
              target: '_blank',
            },
            {
              text: 'Dev Tools',
              href: 'https://docs.boba.network/developer',
              target: '_blank',
            },
            { text: 'Bobascope', href: '/bobascope' },
            {
              text: 'Boba Network Website',
              href: 'https://boba.network',
              target: '_blank',
            },
            {
              text: 'Terms of Use',
              href: 'https://boba.network/terms-of-use/',
              target: '_blank',
            },
          ]

          // Check if the footer links container exists
          cy.get('#footerLinks').should('exist')

          // Iterate over each link and compare with the expected data
          cy.get('#footerLinks')
            .find('a')
            .each(($link, index) => {
              cy.wrap($link).should('have.text', expectedLinks[index].text)
              cy.wrap($link).should(
                'have.attr',
                'href',
                expectedLinks[index].href
              )
              if (expectedLinks[index].target) {
                cy.wrap($link).should(
                  'have.attr',
                  'target',
                  expectedLinks[index].target
                )
              }
            })
        })
      })

      describe('Block Explorer', () => {
        it('should open modal on click block expolorer with correct labels and closes menu on backdrop click', () => {
          cy.get('[data-testid="Block explorers"]').should('be.visible').click()

          cy.get('#blockexplorer').should('exist').and('be.visible')

          cy.get('#blockexplorer')
            .find('li')
            .each(($link, index) => {
              const expectedText = [
                'Etherscan',
                'Bobascan',
                'Optimism',
                'Arbitrum',
                'Binance Smart Chain',
                'Boba BNB',
              ]

              cy.wrap($link).find('p').should('have.text', expectedText[index])
            })
          cy.get('.MuiBackdrop-root').click()
        })
      })

      describe('SocialLinks', () => {
        it('should have social links with correct href attributes', () => {
          const socialLinks = [
            { href: 'https://docs.boba.network', label: 'bobadocs' },
            { href: 'https://boba.eco/twitter', label: 'twitter' },
            { href: 'https://boba.eco/discord', label: 'discord' },
            { href: 'https://boba.eco/telegram', label: 'telegram' },
          ]

          cy.get('#socialLinks a').each(($link, index) => {
            cy.wrap($link).should('have.attr', 'href', socialLinks[index].href)
            cy.wrap($link).should(
              'have.attr',
              'aria-label',
              socialLinks[index].label
            )
          })
        })

        it('should display the correct company name', () => {
          const expectedCompanyName = 'Enya Labs'

          cy.get('#socialLinks p').should('contain.text', expectedCompanyName)
        })
      })
    })
  })
})
