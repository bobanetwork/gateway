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
      test('tBNB', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.addAndConnectBNBTestnet()
        await bridgeAction.classicBridgeDeposit({
          amountToBridge,
          tokenSymbol: 'tBNB',
          networkKey: 'bnb',
        })
      })
      test('BOBA', async ({ page }) => {
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
    test.describe('Withdraw', () => {
      test('BOBA', async ({ page }) => {
        test.setTimeout(120000)
        const basePage = new BasePage(page)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.addAndConnectBNBTestnet()
        await bridgeAction.switchL2Network()
        page.waitForTimeout(2000)
        await basePage.connectToMetamask(true)
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge: '0.00001',
          tokenSymbol: 'tBNB',
          networkKey: 'bnb',
        })
      })
    })
  })
})
