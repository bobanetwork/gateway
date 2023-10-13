// @ts-ignore
import * as NetworkUtils from './src/util/network/network.util'
/**
 * @type {Cypress.PluginConfig}
 */
export const gatewayPlugins = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    error(message) {
      console.error('\u001B[31m', 'ERROR:', message, '\u001B[0m')
      return true
    },
    warn(message) {
      console.warn('\u001B[33m', 'WARNING:', message, '\u001B[0m')
      return true
    },
    // playwright commands
    networkUtils: NetworkUtils,
  })

  if (process.env.BASE_URL) {
    config.e2e.baseUrl = process.env.BASE_URL
    config.component.baseUrl = process.env.BASE_URL
  }

  if (process.env.CI) {
    config.retries.runMode = 1
    config.retries.openMode = 1
  }

  if (process.env.SKIP_METAMASK_SETUP) {
    config.env.SKIP_METAMASK_SETUP = true
  }

  return config
}
