import { defineConfig } from 'cypress'
import synpressPlugins from '@synthetixio/synpress/plugins'
import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  userAgent: 'synpress',
  chromeWebSecurity: true,
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 60000,
  requestTimeout: 60000,
  video: !!process.env.CYPRESS_ENABLE_VIDEO || false,
  e2e: {
    testIsolation: false,
    setupNodeEvents: (on, config) => {
      synpressPlugins(on, config)
    },
    baseUrl: 'https://staging.gateway.boba.network',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      `cypress/e2e/specs/history.spec.cy.ts`,
      // `cypress/e2e/specs/layout.spec.cy.ts`,
      // `cypress/e2e/specs/*.spec.cy.ts`,
      // 'cypress/e2e/specs/flow/connect.spec.cy.ts',
      // 'cypress/e2e/specs/flow/tokenPicker.spec.cy.ts',
      // 'cypress/e2e/specs/flow/feeSwitching.spec.cy.ts',
      // 'cypress/e2e/specs/flow/bridging.spec.cy.ts',
    ],
  },
  includeShadowDom: true,
})
