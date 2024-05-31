import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'

const amountToBridge: string = '0.0002'

test.beforeEach(async ({ page }) => {
  await page.goto('/bridge')
  page.on('console', (msg) => console.log(msg.text()))
})

test.describe('Gateway ETHEREUM (Sepolia)', () => {
  test.describe('Classic Bridge', () => {
    test('Should Deposit ETH Successfully', async ({ page }) => {
      test.setTimeout(120000)
      const bridgeAction = new GatewayAction(page)
      await bridgeAction.connectToTestnet()
      await bridgeAction.classicBridgeDeposit({
        amountToBridge,
        tokenSymbol: 'ETH',
      })
    })

    test('Should Deposit BOBA Successfully', async ({ page }) => {
      test.setTimeout(120000)
      const bridgeAction = new GatewayAction(page)
      await bridgeAction.connectToTestnet()
      await bridgeAction.classicBridgeDeposit({
        amountToBridge,
        tokenSymbol: 'BOBA',
      })
    })
  })
})
