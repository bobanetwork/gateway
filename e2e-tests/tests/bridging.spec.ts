import { test } from '../fixture/synpress'
import { BridgeAction } from '../lib/bridgeAction'
import { BasePage } from '../pages/basePage'
import { BridgePage } from '../pages/bridgePage'

const amountToBridge: string = '0.0001'

test.beforeEach(async ({ page }) => {
  await page.goto('/bridge')
  page.on('console', (msg) => console.log(msg.text()))
})

test.describe('Gateway ETHEREUM (Sepolia)', () => {
  test.describe('Classic Bridge', () => {
    test('Should Deposit ETH Successfully', async ({ page }) => {
      test.setTimeout(120000)
      const bridgeAction = new BridgeAction(page)
      await bridgeAction.classicBridgeDeposit({
        amountToBridge,
        tokenSymbol: 'ETH',
      })
    })

    test('Should Deposit BOBA Successfully', async ({ page }) => {
      test.setTimeout(150000)
      const bridgeAction = new BridgeAction(page)
      await bridgeAction.classicBridgeDeposit({
        amountToBridge,
        tokenSymbol: 'BOBA',
        successWaitTime: 2000,
      })
    })
  })
})
