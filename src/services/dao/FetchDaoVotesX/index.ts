import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { formatEther } from '@ethersproject/units'

export const FetchDaoVotesX = async () => {
  if (!networkService.xBobaContract || walletService.account) {
    return
  }

  try {
    const votes = await networkService.xBobaContract.getCurrentVotes(
      walletService.account
    )
    return { votesX: formatEther(votes) }
  } catch (error) {
    console.log('NS: fetchDaoVotesX error:', error)
    return error
  }
}
