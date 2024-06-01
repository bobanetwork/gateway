import { test } from '../fixture/synpress'
import { GatewayAction } from '../lib/gatewayAction'

const amountToBridge: string = '0.0013'

test.beforeEach(async ({ page }) => {
  await page.goto('/bridge')
  page.on('console', (msg) => console.log(msg.text()))
})

test.describe('Gateway ETHEREUM (Sepolia)', () => {
  test.describe('Classic Bridge', () => {
    test.describe('Deposit', () => {
      test.skip()
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
          amountToBridge: '0.0012',
          tokenSymbol: 'BOBA',
        })
      })
    })

    test.describe('Withdraw', () => {
      test('Should withdraw ETH Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet() // connected to L1.
        await bridgeAction.switchNetwork() // switches to L2.
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge,
          tokenSymbol: 'ETH',
        }) // switches to L2.
      })
      test('Should withdraw BOBA Successfully', async ({ page }) => {
        test.setTimeout(120000)
        const bridgeAction = new GatewayAction(page)
        await bridgeAction.connectToTestnet() // connected to L1.
        await bridgeAction.switchNetwork() // switches to L2.
        await bridgeAction.classicBridgeWithdrawal({
          amountToBridge,
          tokenSymbol: 'ETH',
        }) // switches to L2.
      })
    })
  })
})
