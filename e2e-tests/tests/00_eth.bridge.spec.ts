import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'

let amountToBridge: string = '0.0001'

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

  test('should deposit ETH token with classic bridge', async () => {
    await gatewayAction.classicBridge({
      amountToBridge,
      tokenSymbol: 'ETH',
      estimatedTime: '13 ~ 14mins.',
    })
    await gatewayAction.doDepositClassicBridge({
      amountToBridge,
    })
  })

  test.fixme('should deposit BOBA token with classic bridge', async () => {
    await gatewayAction.classicBridge({
      amountToBridge,
      tokenSymbol: 'BOBA',
      estimatedTime: '13 ~ 14mins.',
    })
    await gatewayAction.doDepositClassicBridge({
      amountToBridge,
      approveAllowance: true,
    })
  })

  test('should withdraw ETH token with classic bridge', async () => {
    await gatewayAction.switchToL2AndReset()
    await gatewayAction.classicBridge({
      amountToBridge,
      estimatedTime: '7 days',
      tokenSymbol: 'ETH',
    })
    await gatewayAction.doWithdrawClassicBridge()
  })

  test('should withdraw BOBA token with classic bridge', async () => {
    await gatewayAction.switchToL2AndReset()
    await gatewayAction.classicBridge({
      amountToBridge,
      estimatedTime: '7 days',
      tokenSymbol: 'BOBA',
    })
    await gatewayAction.doWithdrawClassicBridge()
  })

  test('should deposit ETH token with light bridge', async () => {
    await gatewayAction.lightBridge({
      amountToBridge: '0.01',
      tokenSymbol: 'ETH',
    })
  })

  test.fixme('should deposit BOBA token with light bridge', async () => {
    await gatewayAction.lightBridge({
      amountToBridge: '20.021',
      tokenSymbol: 'BOBA',
      approveAllowance: true,
    })
  })

  test('should withdraw ETH token with light bridge', async () => {
    amountToBridge = '0.01'
    await gatewayAction.switchToL2AndReset()
    const receivableAmt = Number(amountToBridge) * ((100 - 1) / 100)
    await gatewayAction.lightBridge({
      amountToBridge,
      receivableAmt,
      tokenSymbol: 'ETH',
    })
  })

  test('should withdraw BOBA token with light bridge', async () => {
    amountToBridge = '20.0211'
    await gatewayAction.switchToL2AndReset()
    const receivableAmt = Number(amountToBridge) * ((100 - 1) / 100)
    await gatewayAction.lightBridge({
      amountToBridge,
      receivableAmt,
      tokenSymbol: 'BOBA',
      approveAllowance: true,
    })
  })
})
