import networkService from 'services/networkService'
import walletService from 'services/wallet.service'
import { formatEther } from '@ethersproject/units'

export const FetchDaoVotes = async () => {
  if (!networkService.BobaContract || !walletService.account) {
    return
  }
  try {
    const votes = await networkService.BobaContract!.getCurrentVotes(
      walletService.account
    )
    return { votes: formatEther(votes) }
  } catch (error) {
    console.log('NS: fetchDaoVotes error:', error)
    return error
  }
}
