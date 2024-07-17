/* 
  Bridging -
    Contract interaction for Deposit & Withdrawal of Tokens 
      - classic & light bridges.
 * For Bnb L2 (Testnet and Mainnet), 
 *   use OptimismPortal to deposit Boba and BNB. 
 *   use L1StandardBridge to deposit ERC20 tokens
 * 
 * For Eth L2, 
 *   use OptimismPortal to deposit Eth
 *   use L1StandardBridge ERC20 tokens
 * 
*/

import { BigNumber, Contract } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import {
  L1ERC20ABI,
  L1StandardBridgeABI,
  OptimismPortalABI,
} from 'services/abi'
import networkService from 'services/networkService'

interface IDepositErc20 {
  recipient?: string
  amount: string
  currency: string
  currencyL2: string
  isBobaBnbToken: boolean
}
interface IDepositNative {
  recipient?: null | string
  amount: string
}

export class BridgeService {
  async anchorageDepositNative({ recipient, amount }: IDepositNative) {
    try {
      if (!networkService.account) {
        throw new Error(`Wallet not connected!`)
      }

      if (!networkService.addresses.OptimismPortalProxy) {
        throw new Error(`Optimism portal address not provided`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`No signer found`)
      }

      const optimismContract = new Contract(
        networkService.addresses.OptimismPortalProxy,
        OptimismPortalABI,
        networkService.L1Provider
      )

      let depositTx: any

      if (recipient) {
        depositTx = await optimismContract
          .connect(signer!)
          .depositTransaction(recipient, amount, 100000, false, [])
      } else {
        depositTx = await signer!.sendTransaction({
          to: optimismContract.address,
          value: amount,
        })
      }

      const txResponse = await depositTx.wait()

      return txResponse
    } catch (error) {
      console.log(`BS: deposit native`, error)
      return error
    }
  }

  async anchorageDepositERC20({
    recipient,
    amount,
    currency,
    currencyL2,
    isBobaBnbToken,
  }: IDepositErc20) {
    try {
      console.log(`▶▶ anchorageDepositERC20`)
      if (!networkService.account) {
        throw new Error(`Wallet not connected!`)
      }

      if (!networkService.addresses.L1StandardBridge) {
        throw new Error(`L1StandardBridge address not found!`)
      }

      if (!networkService.addresses.L1StandardBridgeProxy) {
        throw new Error(`L1StandardBridge address not found!`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`No signer found!`)
      }

      const bobaL1Contract = new Contract(
        networkService.tokenAddresses!.BOBA?.L1,
        L1ERC20ABI,
        networkService.L1Provider
      )

      const bobaTokenContract = bobaL1Contract!.attach(currency)
      const bobaL1Balance = await bobaTokenContract.balanceOf(
        networkService.account
      )

      if (bobaL1Balance.lt(amount)) {
        throw new Error(`Insufficient L1 token balance`)
      }

      const allowance_BN = await bobaTokenContract.allowance(
        networkService.account,
        networkService.addresses.L1StandardBridgeProxy
      )

      const allowed = allowance_BN.gte(BigNumber.from(amount))

      if (!allowed) {
        const L1ApproveTx = await bobaTokenContract
          .connect(signer!)
          .approve(networkService.addresses.L1StandardBridgeProxy, amount)
        await L1ApproveTx.wait()
      }

      let depositTx: any

      if (isBobaBnbToken) {
        const optimismContract = new Contract(
          networkService.addresses.OptimismPortalProxy,
          OptimismPortalABI,
          networkService.L1Provider
        )

        if (recipient) {
          console.log(
            `calling TO L2 depositERC20Transaction(recipient, 0, amount, 100000, false, [])`,
            recipient,
            0,
            amount,
            100000,
            false,
            []
          )
          // in case of boba token for BNB testnet.
          depositTx = await optimismContract
            .connect(signer!)
            .depositERC20Transaction(recipient, 0, amount, 100000, false, [])
        } else {
          depositTx = await optimismContract
            .connect(signer!)
            .depositERC20Transaction(
              networkService.account,
              amount,
              0,
              100000,
              false,
              []
            )
        }
      } else {
        const l1StandardBridgeContract = new Contract(
          networkService.addresses.L1StandardBridgeProxy,
          L1StandardBridgeABI,
          networkService.L1Provider
        )

        const signedContract = l1StandardBridgeContract!.connect(signer)

        if (recipient) {
          depositTx = await signedContract.depositERC20To(
            currency,
            currencyL2,
            recipient,
            amount,
            999999,
            '0x'
          )
        } else {
          depositTx = await signedContract.depositERC20(
            currency,
            currencyL2,
            amount,
            999999,
            '0x'
          )
        }
      }

      const depositReceipt = await depositTx.wait()

      console.log(`✔ Deposit ${formatEther(amount)} tokens to L2`)
      return depositReceipt
    } catch (error) {
      console.log(`BS: deposit ERC20`, error)
      return error
    }
  }
}

export const bridgeService = new BridgeService()
