import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'
import { BasePage } from '../pages/basePage'

const amountToBridge: string = '0.0001'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Gateway BNB (Testnet)', () => {
  test.describe('Classic Bridge', () => {
    test.describe('Deposit', () => {
      test('Should Deposit tBNB Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.addAndConnectBNBTestnet()
        await bridgeAction.classicBridgeDeposit({
          amountToBridge,
          tokenSymbol: 'tBNB',
          networkKey: 'bnb',
        })
      })
      test('Should Deposit BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.addAndConnectBNBTestnet()
        await bridgeAction.classicBridgeDeposit({
          amountToBridge,
          tokenSymbol: 'BOBA',
          approveAllowance: true,
          networkKey: 'bnb',
        })
      })
    })
  })
})
