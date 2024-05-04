import { defineConfig } from 'cypress'

export default defineConfig({
  chromeWebSecurity: true,
  defaultCommandTimeout: 60000,
  pageLoadTimeout: 60000,
  requestTimeout: 60000,
  video: true,
  videosFolder: 'cypress/videos',
  e2e: {
    testIsolation: false,
    // setupNodeEvents(on, config) {
    // // implement node event listeners here
    // },
    baseUrl: 'http://localhost:3000',
    // baseUrl: "https://staging.gateway.boba.network"
  },
})
