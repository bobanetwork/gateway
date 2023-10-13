import { defineConfig } from 'cypress'
import synpressPlugins from '@synthetixio/synpress/plugins'
import { cypressWebpackPlugin } from './cypress.webpack'
import { gatewayPlugins } from './gateway-plugin'
import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  userAgent: 'synpress',
  chromeWebSecurity: true,
  defaultCommandTimeout: 30000,
  pageLoadTimeout: 30000,
  requestTimeout: 30000,
  video: !!process.env.CYPRESS_ENABLE_VIDEO || false,
  e2e: {
    testIsolation: false,
    setupNodeEvents: (on, config) => {
      cypressWebpackPlugin(on, config)
      synpressPlugins(on, config)
      // gatewayPlugins(on, config)
      // const NetworkUtils = require('./src/util/network/network.util')
      // networkUtils: NetworkUtils
    },
    baseUrl: 'https://gateway.boba.network/bridge',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: ['cypress/e2e/**/*.spec.cy.ts'],
  },
  env: {
    target_hash: process.env.CYPRESS_TEST_HASH,
  },
})
