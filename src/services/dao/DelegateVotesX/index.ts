import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const DelegateVotesX = async ({ recipient }) => {
  if (
    networkService.L1orL2 !== 'L2' ||
    !networkService.xBobaContract ||
    !walletService.account
  ) {
    return
  }

  try {
    const tx = await networkService.xBobaContract
      .connect(walletService.provider!.getSigner())
      .delegate(recipient)
    await tx.wait()
    return tx
  } catch (error) {
    console.log('NS: delegateVotesX error:', error)
    return error
  }
}
