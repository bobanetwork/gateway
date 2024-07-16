import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'
import { BasePage } from '../pages/basePage'
import { BridgePage } from '../pages/bridgePage'

const amountToBridge: string = '0.0001'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // To view the page loading console.
  // page.on('console', (msg) => console.log(msg.text()))
})

test.describe('Gateway ETHEREUM (Sepolia)', () => {
  test.describe('Classic Bridge', () => {
    test.describe('Deposit', () => {
      test.only('Should Deposit ETH Successfully', async ({ page }) => {
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
        await bridgeAction.switchNetwork() // switches to L2.
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge,
          tokenSymbol: 'ETH',
        }) // switches to L2.
      })
      test('Should withdraw BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const basePage = new BasePage(page)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet() // connected to L1.
        await bridgeAction.switchNetwork() // switches to L2.
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge,
          tokenSymbol: 'ETH',
        }) // switches to L2.
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
          amountToBridge: '0.01',
          tokenSymbol: 'ETH',
        })
      })

      // NOTE: skip as amount exceed allowance error!
      test.skip('Should Deposit BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.lightBridgeDeposit({
          amountToBridge: '20.002',
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
        await bridgeAction.switchNetwork() // switches to L2.
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
        const bridgePage = new BridgePage(page)
        await bridgeAction.connectToTestnet()
        await bridgeAction.switchNetwork() // switches to L2.
        await basePage.disconnectMetamask()
        await basePage.connectToMetamask(true)
        await bridgePage.switchToLightBridge()
        await bridgePage.openTokenPickerAndSelect('BOBA')
        await bridgePage.bridgeButtonDisable()
        await bridgePage.inputBridgeAmount('20')
        await bridgePage.confirmErrorAlert({
          error:
            'Asset not supported, please choose different asset or one of our other bridge modes.',
        })
      })
    })
  })
})
