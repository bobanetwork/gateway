import { BigNumber, ethers, utils } from 'ethers'
import networkService from 'services/networkService'
import { L2StandardERC20ABI } from 'services//abi'

//Estimate funds transfer from one account to another, on the L2

export const TransferEstimate = async (
  recipient: string,
  value_Wei_String: string,
  currency: string
) => {
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
