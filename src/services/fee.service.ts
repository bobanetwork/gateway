import { BigNumber, ethers, utils } from 'ethers'
import networkService from './networkService'
import {
  BobaGasPriceOracleABI,
  DiscretionaryExitFeeABI,
  L1ERC20ABI,
  L1LiquidityPoolABI,
  L2BillingContractABI,
  L2LiquidityPoolABI,
  L2StandardERC20ABI,
  OVM_GasPriceOracleABI,
} from './abi'
import { Network, NetworkType } from 'util/network/network.util'
import { MIN_NATIVE_L1_BALANCE } from 'util/constant'
import walletService from './wallet.service'
import { logAmount } from 'util/amountConvert'
import { TransactionResponse } from '@ethersproject/providers'

// TODO: move to constant or app config.
const L2GasOracle = '0x420000000000000000000000000000000000000F'
const L1GasLimit = 9999999
export class FeeService {
  async switchFee(targetFee: 'BOBA' | 'ETH') {
    if (networkService.L1orL2 !== 'L2') {
      return
    }

    const bobaFeeContract = new ethers.Contract(
      networkService.addresses.Boba_GasPriceOracle,
      BobaGasPriceOracleABI,
      walletService.provider!.getSigner()
    )

    try {
      let tx: TransactionResponse

      if (targetFee === 'BOBA') {
        tx = await bobaFeeContract.useBobaAsFeeToken()
        await tx.wait()
      } else if (targetFee === 'ETH') {
        tx = await bobaFeeContract.useETHAsFeeToken()
        await tx.wait()
      } else if (targetFee === networkService.L1NativeTokenSymbol) {
        tx = await bobaFeeContract.useSecondaryFeeTokenAsFeeToken()
        await tx.wait()
      } else {
        console.error(`switchFee: Unknown targetFee selected: ${targetFee}`)
        return
      }

      await networkService.getBobaFeeChoice()

      return tx
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async estimateMinL1NativeTokenForFee() {
    try {
      if (networkService.L1orL2 !== 'L2') {
        return 0
      }
      if (networkService.networkGateway === Network.ETHEREUM) {
        // for ethereum l1 fee is always const to 0.002.
        return MIN_NATIVE_L1_BALANCE
      } else {
        // for alt l1 this fee can change
        const bobaFeeContract = new ethers.Contract(
          networkService.addresses.Boba_GasPriceOracle,
          BobaGasPriceOracleABI,
          walletService.provider!.getSigner()
        )

        const minTokenForFee = await bobaFeeContract.secondaryFeeTokenMinimum()

        return logAmount(minTokenForFee.toString(), 18)
      }
    } catch (error) {
      console.log(`Error: estimateMinL1NativeTokenForFree`, error)
      return 0
    }
  }

  async estimateL1SecurityFee() {
    try {
      const payload = networkService.payloadForL1SecurityFee
      const deepCopyPayload = { ...payload }
      delete deepCopyPayload.from
      // Gas oracle
      const gasOracleContract = new ethers.Contract(
        L2GasOracle,
        OVM_GasPriceOracleABI,
        networkService.L2Provider
      )
      const l1SecurityFee = await gasOracleContract.getL1Fee(
        ethers.utils.serializeTransaction(deepCopyPayload)
      )
      return l1SecurityFee.toNumber()
    } catch (error) {
      console.log(`Error estimateL1SecurityFee`, error)
      return 0
    }
  }

  async estimateL2Fee() {
    try {
      const payload = networkService.payloadForL1SecurityFee!
      const l2GasPrice = await networkService.L2Provider!.getGasPrice()
      const l2GasEstimate =
        await networkService.L2Provider!.estimateGas(payload)
      return l2GasPrice.mul(l2GasEstimate).toNumber()
    } catch (error) {
      console.log(`Error: estimateL2Fee`, error)
      return 0
    }
  }

  async getExitFeeFromBillingContract() {
    try {
      const L2BillingContract = new ethers.Contract(
        networkService.addresses.Proxy__BobaBillingContract,
        L2BillingContractABI,
        networkService.L2Provider
      )
      const exitFee = await L2BillingContract.exitFee()
      return ethers.utils.formatEther(exitFee)
    } catch (error) {
      console.log(`Error: exitFee BillingContract`, error)
      return 0
    }
  }

  //Fees are reported as integers, where every int represents 0.1%
  async getL1TotalFeeRate() {
    try {
      const L1LPContract = new ethers.Contract(
        networkService.addresses.L1LPAddress,
        L1LiquidityPoolABI,
        networkService.L1Provider
      )
      const [operatorFeeRate, userMinFeeRate, userMaxFeeRate] =
        await Promise.all([
          L1LPContract.ownerRewardFeeRate(),
          L1LPContract.userRewardMinFeeRate(),
          L1LPContract.userRewardMaxFeeRate(),
        ])

      const feeRateL = Number(userMinFeeRate) + Number(operatorFeeRate)
      const feeRateH = Number(userMaxFeeRate) + Number(operatorFeeRate)

      return {
        feeMin: (feeRateL / 10).toFixed(1),
        feeMax: (feeRateH / 10).toFixed(1),
      }
    } catch (error) {
      console.log('NS: getL1TotalFeeRate error:', error)
      return error
    }
  }

  async getL2TotalFeeRate() {
    try {
      const L2LPContract = new ethers.Contract(
        networkService.addresses.L2LPAddress,
        L2LiquidityPoolABI,
        networkService.L2Provider
      )
      const [operatorFeeRate, userMinFeeRate, userMaxFeeRate] =
        await Promise.all([
          L2LPContract.ownerRewardFeeRate(),
          L2LPContract.userRewardMinFeeRate(),
          L2LPContract.userRewardMaxFeeRate(),
        ])

      const feeRateL = Number(userMinFeeRate) + Number(operatorFeeRate)
      const feeRateH = Number(userMaxFeeRate) + Number(operatorFeeRate)

      return {
        feeMin: (feeRateL / 10).toFixed(1),
        feeMax: (feeRateH / 10).toFixed(1),
      }
    } catch (error) {
      console.log('NS: getL2TotalFeeRate error:', error)
      return error
    }
  }

  async getL1UserRewardFeeRate(tokenAddress: string) {
    try {
      const L1LPContract = new ethers.Contract(
        networkService.addresses.L1LPAddress,
        L1LiquidityPoolABI,
        networkService.L1Provider
      )
      const feeRate = await L1LPContract.getUserRewardFeeRate(tokenAddress)

      return (feeRate / 10).toFixed(1)
    } catch (error) {
      console.log('NS: getL1UserRewardFeeRate error:', error)
      return error
    }
  }

  async getL2UserRewardFeeRate(tokenAddress: string) {
    try {
      const L2LPContract = new ethers.Contract(
        networkService.addresses.L2LPAddress,
        L2LiquidityPoolABI,
        networkService.L2Provider
      )
      const feeRate = await L2LPContract.getUserRewardFeeRate(tokenAddress)
      return (feeRate / 10).toFixed(1)
    } catch (error) {
      console.log('NS: getL2UserRewardFeeRate error:', error)
      return error
    }
  }

  /* Estimate cost of Classical Exit to L1 */
  async getExitCost(currencyAddress: string) {
    try {
      let approvalCost_BN = BigNumber.from('0')

      const gasPrice = await networkService.L2Provider!.getGasPrice()
      console.log('Classical exit gas price', gasPrice.toString())

      if (currencyAddress !== networkService.addresses.L2_ETH_Address) {
        const ERC20Contract = new ethers.Contract(
          currencyAddress,
          L2StandardERC20ABI, //any old abi will do...
          walletService.provider!.getSigner()
        )

        const tx = await ERC20Contract.populateTransaction.approve(
          networkService.addresses.DiscretionaryExitFee,
          utils.parseEther('1.0')
        )

        const approvalGas_BN = await networkService.L2Provider!.estimateGas({
          ...tx,
          from: networkService.gasEstimateAccount,
        })
        approvalCost_BN = approvalGas_BN.mul(gasPrice)
        console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))
      }

      const DiscretionaryExitFeeContract = new ethers.Contract(
        networkService.addresses.DiscretionaryExitFee,
        DiscretionaryExitFeeABI,
        walletService.provider!.getSigner()
      )

      const L2BillingContract = new ethers.Contract(
        networkService.addresses.Proxy__BobaBillingContract,
        L2BillingContractABI,
        networkService.L2Provider
      )
      const exitFee = await L2BillingContract.exitFee()
      let value = utils.parseEther('0.00001').add(exitFee)
      if (networkService.networkGateway === Network.ETHEREUM) {
        value = utils.parseEther('0.00001')
      }

      const tx2 =
        await DiscretionaryExitFeeContract.populateTransaction.payAndWithdraw(
          networkService.addresses.L2_ETH_Address,
          utils.parseEther('0.00001'),
          L1GasLimit,
          ethers.utils.formatBytes32String(new Date().getTime().toString()),
          { value }
        )

      const gas_BN = await networkService.L2Provider!.estimateGas({
        ...tx2,
        from: networkService.gasEstimateAccount,
      })
      console.log('Classical exit gas', gas_BN.toString())

      const cost_BN = gas_BN.mul(gasPrice)
      console.log('Classical exit cost (ETH):', utils.formatEther(cost_BN))

      const totalCost = utils.formatEther(cost_BN.add(approvalCost_BN))
      console.log('Classical exit total cost (ETH):', totalCost)

      //returns total cost in ETH
      return totalCost
    } catch (error) {
      return 0
    }
  }

  /* Estimate cost of Fast Exit to L1 */
  async getFastExitCost(currencyAddress) {
    let approvalCost_BN = BigNumber.from('0')

    const gasPrice = await networkService.L2Provider!.getGasPrice()
    console.log('Fast exit gas price', gasPrice.toString())

    if (currencyAddress !== networkService.addresses.L2_ETH_Address) {
      const ERC20Contract = new ethers.Contract(
        currencyAddress,
        L2StandardERC20ABI, //any old abi will do...
        walletService.provider!.getSigner()
      )

      const tx = await ERC20Contract.populateTransaction.approve(
        networkService.addresses.L2LPAddress,
        utils.parseEther('1.0')
      )

      const approvalGas_BN = await networkService.L2Provider!.estimateGas({
        ...tx,
        from: networkService.gasEstimateAccount,
      })
      approvalCost_BN = approvalGas_BN.mul(gasPrice)
      console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))
    }

    const L2BillingContract = new ethers.Contract(
      networkService.addresses.Proxy__BobaBillingContract,
      L2BillingContractABI,
      networkService.L2Provider
    )

    const approvalAmount = await L2BillingContract.exitFee()

    let value
    if (networkService.networkGateway === Network.ETHEREUM) {
      value =
        currencyAddress === networkService.addresses.L2_ETH_Address
          ? { value: '1' }
          : {}
    } else {
      value =
        currencyAddress === networkService.addresses.L2_ETH_Address
          ? { value: approvalAmount.add('1') }
          : { value: approvalAmount }
    }

    //in some cases zero not allowed
    const tx2 = await networkService
      .L2LPContract!.connect(walletService.provider!.getSigner())
      .populateTransaction.clientDepositL2(
        currencyAddress === networkService.addresses.L2_ETH_Address ? '1' : '0', //ETH does not allow zero
        currencyAddress,
        value
      )

    const depositGas_BN = await networkService.L2Provider!.estimateGas({
      ...tx2,
      from: networkService.gasEstimateAccount,
    })

    let l1SecurityFee = BigNumber.from('0')
    if (networkService.networkType === NetworkType.MAINNET) {
      delete tx2.from
      l1SecurityFee = await networkService.gasOracleContract!.getL1Fee(
        utils.serializeTransaction(tx2)
      )
      // We can't correctly calculate the final l1 securifty fee,
      // so we increase it by 1.1X to make sure that users have
      // enough balance to cover it
      l1SecurityFee = l1SecurityFee.mul('11').div('10')
      console.log('l1Security fee (ETH)', l1SecurityFee.toString())
    }

    const depositCost_BN = depositGas_BN.mul(gasPrice).add(l1SecurityFee)
    console.log('Fast exit cost (ETH):', utils.formatEther(depositCost_BN))

    //returns total cost in ETH
    return utils.formatEther(depositCost_BN.add(approvalCost_BN))
  }

  //TODO: bridging.service.ts
  /* Estimate cost of Fast Deposit to L2 */
  async getFastDepositCost(currencyAddress: string) {
    let approvalCost_BN = BigNumber.from('0')

    const gasPrice = await networkService.L1Provider!.getGasPrice()
    console.log('Fast deposit gas price', gasPrice.toString())

    if (currencyAddress !== networkService.addresses.L1_ETH_Address) {
      const ERC20Contract = new ethers.Contract(
        currencyAddress,
        L1ERC20ABI, //any old abi will do...
        walletService.provider!.getSigner()
      )

      const tx = await ERC20Contract.populateTransaction.approve(
        networkService.addresses.L1LPAddress,
        utils.parseEther('1.0')
      )

      const approvalGas_BN = await networkService.L1Provider!.estimateGas(tx)
      approvalCost_BN = approvalGas_BN.mul(gasPrice)
      console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))
    }

    //in some cases zero not allowed
    const tx2 = await networkService
      .L1LPContract!.connect(walletService.provider!.getSigner())
      .populateTransaction.clientDepositL1(
        currencyAddress === networkService.addresses.L1_ETH_Address ? '1' : '0', //ETH does not allow zero
        currencyAddress,
        currencyAddress === networkService.addresses.L1_ETH_Address
          ? { value: '1' }
          : {}
      )

    const depositGas_BN = await networkService.L1Provider!.estimateGas(tx2)
    console.log('Fast deposit gas', depositGas_BN.toString())

    const depositCost_BN = depositGas_BN.mul(gasPrice)
    console.log('Fast deposit cost (ETH):', utils.formatEther(depositCost_BN))

    //returns total cost in ETH
    return utils.formatEther(depositCost_BN.add(approvalCost_BN))
  }
}

const feeService = new FeeService()
export default feeService
