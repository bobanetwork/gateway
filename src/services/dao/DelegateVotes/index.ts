import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { formatEther } from '@ethersproject/units'

export const DelegateVotes = async ({ recipient }) => {
  // FIXEME: move layer check the function invocation itself.
  if (
    networkService.L1orL2 !== 'L2' ||
    !networkService.BobaContract ||
    !walletService.account
  ) {
    return
  }

  try {
    const tx = await networkService
      .BobaContract!.connect(walletService.provider!.getSigner())
      .delegate(recipient)
    await tx.wait()
    return tx
  } catch (error) {
    console.log('NS: delegateVotes error:', error)
    return error
  }
}
