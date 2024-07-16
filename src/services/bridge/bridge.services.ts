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

import { Contract } from 'ethers'
import { OptimismPortalABI } from 'services/abi'
import networkService from 'services/networkService'

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

  // async anchorageDepositERC20() {

  // }

  // async anchorageWithdrawNative() {

  // }

  // async anchorageWithdrawERC20() {

  // }
}

export const bridgeService = new BridgeService()
