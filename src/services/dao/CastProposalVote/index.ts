import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const CastProposalVote = async ({ id, userVote }) => {
  if (!networkService.delegateContract || !walletService.account) {
    return
  }
  try {
    const delegateCheck = networkService.delegateContract
      .connect(walletService.provider!.getSigner())
      .attach(networkService.addresses.GovernorBravoDelegator)
    return delegateCheck.castVote(id, userVote)
  } catch (error) {
    console.log('NS: castProposalVote error:', error)
    return error
  }
}
