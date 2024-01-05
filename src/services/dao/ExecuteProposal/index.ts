import networkService from 'services/networkService'
import walletService from 'services/wallet.service'

export const ExecuteProposal = async (proposalId: string | number) => {
  if (!networkService.delegateContract || !walletService.account) {
    return
  }

  try {
    const delegateCheck = networkService.delegateContract
      .connect(walletService.provider!.getSigner())
      .attach(networkService.addresses.GovernorBravoDelegator)
    return delegateCheck.execute(Number(proposalId))
  } catch (error) {
    console.log('NS: executeProposal error:', error)
    return error
  }
}
