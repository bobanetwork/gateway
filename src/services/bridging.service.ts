import { setFetchDepositTxBlock } from 'actions/bridgeAction'
import { Network } from 'util/network/network.util'
import networkService from './networkService'
import { BigNumber, BigNumberish, ethers, utils } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import {
  DiscretionaryExitFeeABI,
  L1ERC20ABI,
  L2BillingContractABI,
  L2StandardERC20ABI,
} from './abi'
import balanceService from './balance.service'
import {
  updateSignatureStatus_depositLP,
  updateSignatureStatus_exitLP,
  updateSignatureStatus_exitTRAD,
} from 'actions/signAction'
import walletService from './wallet.service'

export class BridgingService {
  // Fast Deposit to L2
  async depositL1LP(currency, value_Wei_String) {
    try {
      await updateSignatureStatus_depositLP(false)
      setFetchDepositTxBlock(false)

      const depositTX = await networkService
        .L1LPContract!.connect(walletService.provider!.getSigner())
        .clientDepositL1(
          value_Wei_String,
          currency,
          currency === networkService.addresses.L1_ETH_Address
            ? { value: value_Wei_String }
            : {}
        )

      setFetchDepositTxBlock(true)

      //at this point the tx has been submitted, and we are waiting...
      await depositTX.wait()
      await updateSignatureStatus_depositLP(true)

      const opts = {
        fromBlock: -4000,
      }
      const receipt = await networkService.watcher!.waitForMessageReceipt(
        depositTX,
        opts
      )
      const txReceipt = receipt.transactionReceipt
      console.log(' completed swap-on ! L2 tx hash:', txReceipt)
      return txReceipt
    } catch (error) {
      console.log('NS: depositL1LP error:', error)
      return error
    }
  }

  /**
   * Move ETH from L1 to L2 using the standard deposit system
   *
   * - Deposit ETH from L1 to L2.
   * - Deposit ETH from L1 to another L2 account.
   **/

  async depositETHToL2({ recipient = null, value_Wei_String }) {
    try {
      setFetchDepositTxBlock(false)

      let depositTX
      if (networkService.network === Network.ETHEREUM) {
        if (!recipient) {
          depositTX = await networkService
            .L1StandardBridgeContract!.connect(
              networkService.provider!.getSigner()
            )
            .depositETH(
              networkService.L2GasLimit,
              utils.formatBytes32String(new Date().getTime().toString()),
              {
                value: value_Wei_String,
              }
            )
        } else {
          depositTX = await networkService
            .L1StandardBridgeContract!.connect(
              networkService.provider!.getSigner()
            )
            .depositETHTo(
              recipient,
              networkService.L2GasLimit,
              utils.formatBytes32String(new Date().getTime().toString()),
              {
                value: value_Wei_String,
              }
            )
        }
      } else {
        if (!recipient) {
          depositTX = await networkService
            .L1StandardBridgeContract!.connect(
              networkService.provider!.getSigner()
            )
            .depositNativeToken(
              networkService.L2GasLimit,
              utils.formatBytes32String(new Date().getTime().toString()),
              {
                value: value_Wei_String,
              }
            )
        } else {
          depositTX = await networkService
            .L1StandardBridgeContract!.connect(
              networkService.provider!.getSigner()
            )
            .depositNativeTokenTo(
              recipient,
              networkService.L2GasLimit,
              utils.formatBytes32String(new Date().getTime().toString()),
              {
                value: value_Wei_String,
              }
            )
        }
      }

      setFetchDepositTxBlock(true)

      //at this point the tx has been submitted, and we are waiting...
      await depositTX.wait()

      const opts = {
        fromBlock: -4000,
      }

      const receipt = await networkService.watcher!.waitForMessageReceipt(
        depositTX,
        opts
      )
      const txReceipt = receipt.transactionReceipt
      console.log('completed Deposit! L2 tx hash:', receipt.transactionReceipt)
      return txReceipt
    } catch (error) {
      console.log('NS: depositETHL2 error:', error)
      return error
    }
  }

  //Estimate funds transfer from one account to another, on the L2
  async transferEstimate(
    recipient: string,
    value_Wei_String: string,
    currency: string
  ) {
    const gasPrice_BN = await networkService.L2Provider!.getGasPrice()

    let cost_BN = BigNumber.from('0')
    let gas_BN = BigNumber.from('0')

    try {
      if (currency === networkService.addresses.L2_ETH_Address) {
        gas_BN = await networkService.provider!.getSigner().estimateGas({
          from: networkService.account,
          to: recipient,
          value: value_Wei_String,
        })

        cost_BN = gas_BN.mul(gasPrice_BN)
        console.log('ETH: Transfer cost in ETH:', utils.formatEther(cost_BN))
      } else {
        const ERC20Contract = new ethers.Contract(
          currency,
          L2StandardERC20ABI, // any old abi will do...
          networkService.provider!.getSigner()
        )

        const tx = await ERC20Contract.populateTransaction.transfer(
          recipient,
          value_Wei_String
        )

        gas_BN = await networkService.L2Provider!.estimateGas(tx)

        cost_BN = gas_BN.mul(gasPrice_BN)
        console.log('ERC20: Transfer cost in ETH:', utils.formatEther(cost_BN))
      }

      const safety_margin = BigNumber.from('1000000000000')
      console.log('ERC20: Safety margin:', utils.formatEther(safety_margin))

      return cost_BN.add(safety_margin)
    } catch (error) {
      console.log('NS: transferEstimate error:', error)
      return error
    }
  }

  //Transfer funds from one account to another, on the L2
  async transfer(
    address: string,
    value_Wei_String: BigNumberish,
    currency: string
  ) {
    let tx: TransactionResponse

    try {
      if (currency === networkService.addresses.L2_ETH_Address) {
        //we are sending ETH

        const wei = BigNumber.from(value_Wei_String)

        tx = await networkService.provider!.getSigner().sendTransaction({
          to: address,
          value: utils.hexlify(wei),
        })
      } else {
        //any ERC20 json will do....
        tx = await networkService
          .L2_TEST_Contract!.connect(networkService.provider!.getSigner())
          .attach(currency)
          .transfer(address, value_Wei_String)
        await tx.wait()
      }

      return tx
    } catch (error) {
      console.log('NS: transfer error:', error)
      return error
    }
  }

  //Used to move ERC20 Tokens from L1 to L2 using the classic deposit
  async depositErc20({
    recipient = null,
    value_Wei_String,
    currency,
    currencyL2,
  }) {
    const L1_TEST_Contract = networkService.L1_TEST_Contract!.attach(currency)

    let allowance_BN = await L1_TEST_Contract.allowance(
      networkService.account,
      networkService.addresses.L1StandardBridgeAddress
    )
    setFetchDepositTxBlock(false)
    try {
      /*
      OMG IS A SPECIAL CASE - allowance needs to be set to zero, and then
      set to actual amount, unless current approval amount is equal to, or
      bigger than, the current approval value
      */
      if (
        networkService.networkGateway === Network.ETHEREUM &&
        allowance_BN.lt(BigNumber.from(value_Wei_String)) &&
        currency.toLowerCase() ===
          networkService.tokenAddresses!.OMG.L1.toLowerCase()
      ) {
        console.log(
          "Current OMG Token allowance too small - might need to reset to 0, unless it's already zero"
        )
        if (allowance_BN.gt(BigNumber.from('0'))) {
          const approveOMG = await L1_TEST_Contract.approve(
            networkService.addresses.L1StandardBridgeAddress,
            ethers.utils.parseEther('0')
          )
          await approveOMG.wait()
          console.log('OMG Token allowance has been set to 0')
        }
      }

      //recheck the allowance
      allowance_BN = await L1_TEST_Contract.allowance(
        networkService.account,
        networkService.addresses.L1StandardBridgeAddress
      )

      const allowed = allowance_BN.gte(BigNumber.from(value_Wei_String))

      if (!allowed) {
        //and now, the normal allowance transaction
        const approveStatus = await L1_TEST_Contract.connect(
          networkService.provider!.getSigner()
        ).approve(
          networkService.addresses.L1StandardBridgeAddress,
          value_Wei_String
        )
        await approveStatus.wait()
        console.log('ERC20 L1 ops approved:', approveStatus)
      }
      let depositTX
      if (!recipient) {
        // incase no recipient
        depositTX = await networkService
          .L1StandardBridgeContract!.connect(
            networkService.provider!.getSigner()
          )
          .depositERC20(
            currency,
            currencyL2,
            value_Wei_String,
            networkService.L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString())
          )
      } else {
        // deposit ERC20 to L2 account address.
        depositTX = await networkService
          .L1StandardBridgeContract!.connect(
            networkService.provider!.getSigner()
          )
          .depositERC20To(
            currency,
            currencyL2,
            recipient,
            value_Wei_String,
            networkService.L2GasLimit,
            utils.formatBytes32String(new Date().getTime().toString())
          )
      }
      setFetchDepositTxBlock(true)
      //at this point the tx has been submitted, and we are waiting...
      await depositTX.wait()

      const opts = {
        fromBlock: -4000,
      }
      const receipt = await networkService.watcher!.waitForMessageReceipt(
        depositTX,
        opts
      )
      const txReceipt = receipt.transactionReceipt
      await balanceService.getBalances()
      return txReceipt
    } catch (error) {
      console.log('NS: depositErc20 error:', error)
      return error
    }
  }

  //Standard 7 day exit from BOBA
  async exitBOBA(currencyAddress, value_Wei_String) {
    await updateSignatureStatus_exitTRAD(false)

    try {
      const L2BillingContract = new ethers.Contract(
        networkService.addresses.Proxy__BobaBillingContract,
        L2BillingContractABI,
        networkService.L2Provider
      )
      let BobaApprovalAmount = await L2BillingContract.exitFee()

      //now coming in as a value_Wei_String
      const value = BigNumber.from(value_Wei_String)

      const allowance = await this.checkAllowance(
        currencyAddress,
        networkService.addresses.DiscretionaryExitFee
      )

      const BobaAllowance = await this.checkAllowance(
        networkService.addresses.TK_L2BOBA,
        networkService.addresses.DiscretionaryExitFee
      )

      if (networkService.networkGateway === Network.ETHEREUM) {
        // Should approve BOBA
        if (
          utils.getAddress(currencyAddress) ===
          utils.getAddress(networkService.addresses.TK_L2BOBA)
        ) {
          BobaApprovalAmount = BobaApprovalAmount.add(value)
        }

        if (BobaAllowance.lt(BobaApprovalAmount)) {
          const res = await this.approveERC20(
            BobaApprovalAmount,
            networkService.addresses.TK_L2BOBA,
            networkService.addresses.DiscretionaryExitFee
          )
          if (!res) {
            return false
          }
        }
      }

      let otherField
      if (networkService.networkGateway === Network.ETHEREUM) {
        otherField =
          currencyAddress === networkService.addresses.L2_ETH_Address
            ? { value }
            : {}
      } else {
        otherField =
          currencyAddress === networkService.addresses.L2_ETH_Address
            ? { value: value.add(BobaApprovalAmount) }
            : { value: BobaApprovalAmount }
      }

      // Should approve other tokens
      if (
        currencyAddress !== networkService.addresses.L2_ETH_Address &&
        utils.getAddress(currencyAddress) !==
          utils.getAddress(networkService.addresses.TK_L2BOBA) &&
        allowance.lt(value)
      ) {
        const res = await this.approveERC20(
          value,
          currencyAddress,
          networkService.addresses.DiscretionaryExitFee
        )
        if (!res) {
          return false
        }
      }

      const DiscretionaryExitFeeContract = new ethers.Contract(
        networkService.addresses.DiscretionaryExitFee,
        DiscretionaryExitFeeABI,
        networkService.provider!.getSigner()
      )

      const tx = await DiscretionaryExitFeeContract.payAndWithdraw(
        currencyAddress,
        value_Wei_String,
        networkService.L1GasLimit,
        utils.formatBytes32String(new Date().getTime().toString()),
        otherField
      )

      //everything submitted... waiting
      await tx.wait()

      //can close window now
      await updateSignatureStatus_exitTRAD(true)

      return tx
    } catch (error) {
      console.log('NS: exitBOBA error:', error)
      return error
    }
  }

  async checkAllowance(currencyAddress: string, targetContract: string) {
    try {
      const ERC20Contract = new ethers.Contract(
        currencyAddress,
        L1ERC20ABI, //could use any abi - just something with .allowance
        walletService.provider!.getSigner()
      )
      return await ERC20Contract.allowance(
        walletService.account,
        targetContract
      )
    } catch (error) {
      console.log('NS: checkAllowance error:', error)
      return error
    }
  }

  async depositL2LP(currencyAddress: string, value_Wei_String: BigNumberish) {
    await updateSignatureStatus_exitLP(false)

    const L2BillingContract = new ethers.Contract(
      networkService.addresses.Proxy__BobaBillingContract,
      L2BillingContractABI,
      networkService.L2Provider
    )
    let BobaApprovalAmount = await L2BillingContract.exitFee()

    const BobaAllowance = await this.checkAllowance(
      networkService.addresses.TK_L2BOBA,
      networkService.addresses.L2LPAddress
    )

    try {
      if (networkService.networkGateway === Network.ETHEREUM) {
        // Approve BOBA first only when the Boba is not native token.
        if (
          utils.getAddress(currencyAddress) ===
          utils.getAddress(networkService.addresses.TK_L2BOBA)
        ) {
          BobaApprovalAmount = BobaApprovalAmount.add(
            BigNumber.from(value_Wei_String)
          )
        }
        if (BobaAllowance.lt(BobaApprovalAmount)) {
          const approveStatus = await this.approveERC20(
            BobaApprovalAmount,
            networkService.addresses.TK_L2BOBA,
            networkService.addresses.L2LPAddress
          )
          if (!approveStatus) {
            return false
          }
        }
      }

      // Approve other tokens
      if (
        currencyAddress !== networkService.addresses.L2_ETH_Address &&
        utils.getAddress(currencyAddress) !==
          utils.getAddress(networkService.addresses.TK_L2BOBA)
      ) {
        const L2ERC20Contract = new ethers.Contract(
          currencyAddress,
          L2StandardERC20ABI,
          networkService.provider!.getSigner()
        )

        const allowance_BN = await L2ERC20Contract.allowance(
          networkService.account,
          networkService.addresses.L2LPAddress
        )

        const depositAmount_BN = BigNumber.from(value_Wei_String)

        if (depositAmount_BN.gt(allowance_BN)) {
          const approveStatus = await L2ERC20Contract.approve(
            networkService.addresses.L2LPAddress,
            value_Wei_String
          )
          await approveStatus.wait()
          if (!approveStatus) {
            return false
          }
        }
      }

      const time_start = new Date().getTime()
      console.log('TX start time:', time_start)

      let otherField
      if (networkService.networkGateway === Network.ETHEREUM) {
        otherField =
          currencyAddress === networkService.addresses.L2_ETH_Address
            ? { value: value_Wei_String }
            : {}
      } else {
        otherField =
          currencyAddress === networkService.addresses.L2_ETH_Address
            ? { value: BobaApprovalAmount.add(value_Wei_String) }
            : { value: BobaApprovalAmount }
      }

      const depositTX = await networkService
        .L2LPContract!.connect(networkService.provider!.getSigner())
        .clientDepositL2(value_Wei_String, currencyAddress, otherField)

      //at this point the tx has been submitted, and we are waiting...
      await depositTX.wait()

      const block = await networkService.L2Provider!.getTransaction(
        depositTX.hash
      )
      console.log(' block:', block)

      //closes the modal
      await updateSignatureStatus_exitLP(true)

      return depositTX
    } catch (error) {
      console.log('NS: depositL2LP error:', error)
      return error
    }
  }

  async approveERC20(
    value_Wei_String: BigNumberish,
    currency: string,
    approveContractAddress: string = networkService.addresses
      .L1StandardBridgeAddress,
    contractABI = L1ERC20ABI
  ) {
    try {
      const ERC20Contract = new ethers.Contract(
        currency,
        contractABI,
        walletService.provider!.getSigner()
      )

      /***********************/

      let allowance_BN = await ERC20Contract.allowance(
        walletService.account,
        approveContractAddress
      )
      console.log('Initial Allowance is:', allowance_BN)

      /*
      OMG IS A SPECIAL CASE - allowance needs to be set to zero, and then
      set to actual amount, unless current approval amount is equal to, or
      bigger than, the current approval value
      */
      if (
        networkService.networkGateway === Network.ETHEREUM &&
        allowance_BN.lt(BigNumber.from(value_Wei_String)) &&
        currency.toLowerCase() ===
          networkService.tokenAddresses!.OMG.L1.toLowerCase()
      ) {
        console.log(
          "Current OMG Token allowance too small - might need to reset to 0, unless it's already zero"
        )
        if (allowance_BN.gt(BigNumber.from('0'))) {
          const approveOMG = await ERC20Contract.approve(
            approveContractAddress,
            ethers.utils.parseEther('0')
          )
          await approveOMG.wait()
          console.log('OMG Token allowance has been set to 0')
        }
      }

      //recheck the allowance
      allowance_BN = await ERC20Contract.allowance(
        walletService.account,
        approveContractAddress
      )
      console.log('Second Allowance is:', allowance_BN)

      const allowed = allowance_BN.gte(BigNumber.from(value_Wei_String))

      console.log('Allowed?:', allowed)

      if (!allowed) {
        console.log('Not good enough - need to set to:', value_Wei_String)
        //and now, the normal allowance transaction
        const approveStatus = await ERC20Contract.approve(
          approveContractAddress,
          value_Wei_String
        )
        await approveStatus.wait()
        console.log('ERC20 L1 SWAP ops approved:', approveStatus)
      }

      return true
    } catch (error) {
      console.log('NS: approveERC20 error:', error)
      return error
    }
  }
}

const bridgingService = new BridgingService()
export default bridgingService
