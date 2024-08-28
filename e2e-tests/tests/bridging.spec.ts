import { test } from '../fixture/synpress'
import { CLASSIC_BRIDGE_TOKEN, LIGHT_BRIDGE_TOKEN } from '../lib/constants'
import { GatewayAction } from '../lib/gatewayAction'
import { BasePage } from '../pages/basePage'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Gateway ETHEREUM (Sepolia)', () => {
  test.describe('Classic Bridge', () => {
    test.describe('Deposit', () => {
      test('Should Deposit ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.classicBridgeDeposit({
          amountToBridge: CLASSIC_BRIDGE_TOKEN.ETH.AMOUNT,
          tokenSymbol: CLASSIC_BRIDGE_TOKEN.ETH.SYMBOL,
          networkKey: 'eth',
        })
      })

      test('Should Deposit BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.classicBridgeDeposit({
          amountToBridge: CLASSIC_BRIDGE_TOKEN.BOBA.AMOUNT,
          tokenSymbol: CLASSIC_BRIDGE_TOKEN.BOBA.SYMBOL,
          approveAllowance: true,
          networkKey: 'eth',
        })
      })
    })

    test.describe('Withdraw', () => {
      test('Should withdraw ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const basePage = new BasePage(page)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet() // connected to L1.
        await bridgeAction.switchL2Network()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge: CLASSIC_BRIDGE_TOKEN.ETH.AMOUNT,
          tokenSymbol: CLASSIC_BRIDGE_TOKEN.ETH.SYMBOL,
        })
      })
      test('Should withdraw BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const basePage = new BasePage(page)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet() // connected to L1.
        await bridgeAction.switchL2Network()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge: CLASSIC_BRIDGE_TOKEN.BOBA.AMOUNT,
          tokenSymbol: CLASSIC_BRIDGE_TOKEN.BOBA.SYMBOL,
        })
      })
    })
  })

  test.describe('Light Bridge', () => {
    test.describe('Deposit', () => {
      test('Should Deposit ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.lightBridgeDeposit({
          amountToBridge: LIGHT_BRIDGE_TOKEN.ETH.AMOUNT,
          tokenSymbol: LIGHT_BRIDGE_TOKEN.ETH.SYMBOL,
        })
      })

      test.only('Should Deposit BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.lightBridgeDeposit({
          amountToBridge: LIGHT_BRIDGE_TOKEN.BOBA.AMOUNT,
          tokenSymbol: LIGHT_BRIDGE_TOKEN.BOBA.SYMBOL,
          approveAllowance: true,
        })
      })
    })

    test.describe('Withdrawal', () => {
      test('Should Withdraw ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        const basePage = new BasePage(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.switchL2Network()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.lightBridgeWithdraw({
          amountToBridge: LIGHT_BRIDGE_TOKEN.ETH.AMOUNT,
          tokenSymbol: LIGHT_BRIDGE_TOKEN.ETH.SYMBOL,
        })
      })
      test('Should Withdraw BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        const basePage = new BasePage(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.switchL2Network()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.lightBridgeWithdraw({
          amountToBridge: LIGHT_BRIDGE_TOKEN.BOBA.AMOUNT,
          tokenSymbol: LIGHT_BRIDGE_TOKEN.BOBA.SYMBOL,
          approveAllowance: true,
        })
      })
    })
  })
})
