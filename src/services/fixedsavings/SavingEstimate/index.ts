import { BigNumber, ethers, utils } from 'ethers'
import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { BobaFixedSavingsABI } from 'services/abi'

export const SavingEstimate = async () => {
  // used to generate gas estimates for contracts that cannot set amount === 0
  // to avoid need to approve amount

  const otherField = {
    from: networkService.gasEstimateAccount,
  }

  const gasPrice_BN = await walletService.provider!.getGasPrice()
  console.log('gas price', gasPrice_BN.toString())

  let approvalCost_BN = BigNumber.from('0')
  let stakeCost_BN = BigNumber.from('0')

  try {
    // first, we need the allowance of the benchmarkAccount
    const allowance_BN = await networkService
      .BobaContract!.connect(walletService.provider!)
      .allowance(
        networkService.gasEstimateAccount,
        networkService.addresses.BobaFixedSavings
      )
    console.log('benchmarkAllowance_BN', allowance_BN.toString())

    // second, we need the approval cost
    const tx1 = await networkService
      .BobaContract!.connect(walletService.provider!.getSigner())
      .populateTransaction.approve(
        networkService.addresses.BobaFixedSavings,
        allowance_BN.toString()
      )

    const approvalGas_BN = await walletService.provider!.estimateGas(tx1)
    approvalCost_BN = approvalGas_BN.mul(gasPrice_BN)
    console.log('Approve cost in ETH:', utils.formatEther(approvalCost_BN))

    // third, we need the stake cost
    const FixedSavings = new ethers.Contract(
      networkService.addresses.BobaFixedSavings,
      BobaFixedSavingsABI,
      walletService.provider
    )

    const tx2 = await FixedSavings.populateTransaction.stake(
      allowance_BN.toString(),
      otherField
    )
    const stakeGas_BN = await walletService.provider!.estimateGas(tx2)
    stakeCost_BN = stakeGas_BN.mul(gasPrice_BN)
    console.log('Stake cost in ETH:', utils.formatEther(stakeCost_BN))

    const safety_margin_BN = BigNumber.from('1000000000000')
    console.log('Stake safety margin:', utils.formatEther(safety_margin_BN))

    return approvalCost_BN.add(stakeCost_BN).add(safety_margin_BN)
  } catch (error) {
    console.log('NS: stakingEstimate() error', error)
    return error
  }
}
