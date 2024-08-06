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
import { ERROR_CODE } from 'util/constant'

interface IDepositErc20 {
  recipient?: string
  amount: string
  currency: string
  currencyL2: string
}

interface IDepositErc20Optimism {
  recipient?: string
  amount: string
  currency: string
}

interface IDepositNative {
  recipient?: null | string
  amount: string
}

export class BridgeService {
  async anchorageDepositNative({ recipient, amount }: IDepositNative) {
    try {
      if (!networkService.account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }

      if (!networkService.addresses.OptimismPortalProxy) {
        throw new Error(`${ERROR_CODE} invalid optimism portal address`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`${ERROR_CODE} no signer found`)
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
          .depositTransaction(recipient, 0, 100000, false, [], {
            value: amount,
          })
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
  }: IDepositErc20) {
    try {
      console.log(`▶▶ anchorageDepositERC20`)
      if (!networkService.account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }

      const l1StdBridgeAddress = networkService.addresses.L1StandardBridgeProxy

      if (!l1StdBridgeAddress) {
        throw new Error(`${ERROR_CODE} invalid L1StandardBridge address`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`${ERROR_CODE} no signer found!`)
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
        throw new Error(`${ERROR_CODE} insufficient L1 token balance`)
      }

      const allowance_BN = await bobaTokenContract.allowance(
        networkService.account,
        l1StdBridgeAddress
      )

      const allowed = allowance_BN.gte(BigNumber.from(amount))

      if (!allowed) {
        const L1ApproveTx = await bobaTokenContract
          .connect(signer!)
          .approve(l1StdBridgeAddress, amount)
        await L1ApproveTx.wait()
      }

      let depositTx: any

      const l1StandardBridgeContract = new Contract(
        l1StdBridgeAddress,
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

      const depositReceipt = await depositTx.wait()

      console.log(`✔ Deposit ${formatEther(amount)} tokens to L2`)
      return depositReceipt
    } catch (error) {
      console.log(`BS: deposit ERC20`, error)
      return error
    }
  }

  async anchorageDepositERC20Optimism({
    recipient,
    amount,
    currency,
  }: IDepositErc20Optimism) {
    try {
      console.log(`▶▶ anchorageDepositERC20Optimism`)
      if (!networkService.account) {
        throw new Error(`${ERROR_CODE} wallet not connected!`)
      }

      const opContractAddress = networkService.addresses.OptimismPortalProxy

      if (!opContractAddress) {
        throw new Error(`${ERROR_CODE} invalid optimismPortalProxy address`)
      }

      const signer = networkService.provider?.getSigner()

      if (!signer) {
        throw new Error(`${ERROR_CODE} no signer found`)
      }

      const bobaL1Contract = new Contract(
        networkService.tokenAddresses!.BOBA?.L1,
        L1ERC20ABI,
        networkService.L1Provider
      )

      const bobaTokenContract = bobaL1Contract!.attach(currency!)
      const bobaL1Balance = await bobaTokenContract.balanceOf(
        networkService.account
      )

      if (bobaL1Balance.lt(amount)) {
        throw new Error(`${ERROR_CODE} insufficient L1 token balance`)
      }

      const allowance_BN = await bobaTokenContract.allowance(
        networkService.account,
        opContractAddress
      )

      const allowed = allowance_BN.gte(BigNumber.from(amount))

      if (!allowed) {
        const L1ApproveTx = await bobaTokenContract
          .connect(signer!)
          .approve(opContractAddress, amount)
        await L1ApproveTx.wait()
      }

      let depositTx: any

      const optimismContract = new Contract(
        opContractAddress,
        OptimismPortalABI,
        networkService.L1Provider
      )

      if (recipient) {
        console.log(`deposit BOBA to `, recipient, amount)
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

      const depositReceipt = await depositTx.wait()

      console.log(`✔ Deposited ${formatEther(amount)} tokens to L2`)
      return depositReceipt
    } catch (error) {
      console.log(`BS: deposit ERC20`, error)
      return error
    }
  }
}

export const bridgeService = new BridgeService()
