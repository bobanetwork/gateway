import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'
import { BasePage } from '../pages/basePage'

const amountToBridge: string = '0.0001'

const TEST_TIMEOUT = 120000

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('ETH', () => {
  let gatewayAction

  test.beforeEach(async ({ page }) => {
    gatewayAction = new GatewayAction(page)
    await gatewayAction.connectToTestnet()
    test.setTimeout(TEST_TIMEOUT)
  })

  test('should deposit ETH token with classic bridge', async ({ page }) => {
    await gatewayAction.classicBridgeDeposit({
      amountToBridge,
      tokenSymbol: 'ETH',
    })
  })

  test.skip('should deposit BOBA token with classic bridge', async ({
    page,
  }) => {
    await gatewayAction.classicBridgeDeposit({
      amountToBridge,
      tokenSymbol: 'BOBA',
      approveAllowance: true,
    })
  })

  test.only('should withdraw ETH token with classic bridge', async ({
    page,
  }) => {
    await gatewayAction.classicBridgeWithdrawal({
      amountToBridge,
      tokenSymbol: 'ETH',
    })
  })

  test.only('should withdraw BOBA token with classic bridge', async ({
    page,
  }) => {
    await gatewayAction.classicBridgeWithdrawal({
      amountToBridge,
      tokenSymbol: 'BOBA',
    })
  })

  test('should deposit ETH token with light bridge', async ({ page }) => {
    await gatewayAction.lightBridgeDeposit({
      amountToBridge: '0.01',
      tokenSymbol: 'ETH',
    })
  })

  test('should deposit BOBA token with light bridge', async ({ page }) => {
    await gatewayAction.lightBridgeDeposit({
      amountToBridge: '20.021',
      tokenSymbol: 'BOBA',
      approveAllowance: true,
    })
  })

  test('should withdraw ETH token with light bridge', async ({ page }) => {
    const basePage = new BasePage(page)
    await gatewayAction.switchL2Network()
    await basePage.disconnectMetamask()
    await basePage.connectToMetamask(true)
    await gatewayAction.lightBridgeWithdraw({
      amountToBridge: '0.01',
      tokenSymbol: 'ETH',
    })
  })
  test('should withdraw BOBA token with light bridge', async ({ page }) => {
    const basePage = new BasePage(page)
    await gatewayAction.switchL2Network()
    await basePage.disconnectMetamask()
    await basePage.connectToMetamask(true)
    await gatewayAction.lightBridgeWithdraw({
      amountToBridge: '20.0211',
      tokenSymbol: 'BOBA',
      approveAllowance: true,
    })
  })
})
