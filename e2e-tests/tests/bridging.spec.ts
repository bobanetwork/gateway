import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'
import { BasePage } from '../pages/basePage'
import { BridgePage } from '../pages/bridgePage'

const amountToBridge: string = '0.0001'

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

    test.describe('Withdraw', () => {
      test('Should withdraw ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const basePage = new BasePage(page)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet() // connected to L1.
        await bridgeAction.switchNetwork()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge,
          tokenSymbol: 'ETH',
        })
      })
      test('Should withdraw BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const basePage = new BasePage(page)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet() // connected to L1.
        await bridgeAction.switchNetwork()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge,
          tokenSymbol: 'ETH',
        })
      })
    })
  })

  test.describe('Light Bridge', () => {
    test.describe('Deposit', () => {
      test.only('Should Deposit ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.lightBridgeDeposit({
          amountToBridge: '0.01',
          tokenSymbol: 'ETH',
        })
      })

      test.only('Should Deposit BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.lightBridgeDeposit({
          amountToBridge: '20.021',
          tokenSymbol: 'BOBA',
        })
      })
    })

    test.describe('Withdrawal', () => {
      test('Should Withdraw ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        const basePage = new BasePage(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.switchNetwork()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.lightBridgeWithdraw({
          amountToBridge: '0.01',
          tokenSymbol: 'ETH',
        })
      })
      test('Should Withdraw BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        const basePage = new BasePage(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.switchNetwork()
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.lightBridgeWithdraw({
          amountToBridge: '20.0211',
          tokenSymbol: 'BOBA',
        })
      })
    })
  })
})
