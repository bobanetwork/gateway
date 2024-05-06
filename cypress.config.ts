// import { defineConfig } from 'cypress';

// export default defineConfig({
//   chromeWebSecurity: true,
//   defaultCommandTimeout: 60000,
//   pageLoadTimeout: 60000,
//   requestTimeout: 60000,
//   video: true,
//   videosFolder: 'cypress/videos',
//   e2e: {
//     testIsolation: false,
//     // setupNodeEvents(on, config) {
//     // // implement node event listeners here
//     // },
//     baseUrl: 'http://localhost:3000',
//     // baseUrl: "https://staging.gateway.boba.network"
//   },
// })

import { defineConfig } from 'cypress'
import synpressPlugins from '@synthetixio/synpress/plugins'
import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  userAgent: 'synpress',
  chromeWebSecurity: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  e2e: {
    testIsolation: false,
    setupNodeEvents: (on, config) => {
      synpressPlugins(on, config)
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: ['cypress/e2e/**/*.spec.cy.ts'],
  },
  // env: {
  //   target_hash: process.env.CYPRESS_TEST_HASH,
  // },
})
