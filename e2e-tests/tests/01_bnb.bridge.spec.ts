import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'

let amountToBridge: string = '0.0001'

const TEST_TIMEOUT = 120000

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('BNB', () => {
  let gatewayAction

  test.beforeEach(async ({ page }) => {
    gatewayAction = new GatewayAction(page)
    await gatewayAction.addAndConnectBNBTestnet()
    test.setTimeout(TEST_TIMEOUT)
  })

  test('should deposit tBNB token with classic bridge', async () => {
    await gatewayAction.classicBridge({
      amountToBridge,
      tokenSymbol: 'tBNB',
      estimatedTime: '13 ~ 14mins.',
    })
    await gatewayAction.doDepositClassicBridge({
      amountToBridge,
    })
  })

  // fix conflicting MM popup raise or update to new synpress 4 -beta.
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

  test('should withdraw tBNB token with classic bridge', async () => {
    await gatewayAction.switchToL2AndReset()
    await gatewayAction.connect()
    await gatewayAction.classicBridge({
      amountToBridge,
      estimatedTime: '7 days',
      tokenSymbol: 'tBNB',
    })
    await gatewayAction.doWithdrawClassicBridgeBnb(amountToBridge)
  })

  test('should withdraw BOBA token with classic bridge', async () => {
    await gatewayAction.switchToL2AndReset()
    await gatewayAction.connect()
    await gatewayAction.classicBridge({
      amountToBridge,
      estimatedTime: '7 days',
      tokenSymbol: 'BOBA',
    })
    await gatewayAction.doWithdrawClassicBridge()
  })

  // as of now no supported tokens for teleportation on BNB
  test.fixme('should deposit tBNB token with light bridge', async () => {
    await gatewayAction.lightBridge({
      amountToBridge: '0.01',
      tokenSymbol: 'tBNB',
    })
  })
  // as of now no supported tokens for teleportation on BNB
  test.fixme('should deposit BOBA token with light bridge', async () => {
    await gatewayAction.lightBridge({
      amountToBridge: '20.021',
      tokenSymbol: 'BOBA',
      approveAllowance: true,
    })
  })

  // as of now no supported tokens for teleportation on BNB
  test.fixme('should withdraw tBNB token with light bridge', async () => {
    amountToBridge = '0.01'
    await gatewayAction.switchToL2AndReset()
    const receivableAmt = Number(amountToBridge) * ((100 - 1) / 100)
    await gatewayAction.lightBridge({
      amountToBridge,
      receivableAmt,
      tokenSymbol: 'tBNB',
    })
  })

  // as of now no supported tokens for teleportation on BNB
  test.fixme('should withdraw BOBA token with light bridge', async () => {
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
