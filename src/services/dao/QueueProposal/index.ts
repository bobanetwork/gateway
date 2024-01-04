import networkService from 'services/networkService'
import { formatEther } from '@ethersproject/units'

export const QueueProposal = async (proposalId: string | number) => {
  if (!networkService.delegateContract) {
    return
  }
  try {
    const rawThreshold = await networkService.delegateContract
      .attach(networkService.addresses.GovernorBravoDelegator)
      .proposalThreshold()
    return { proposalThreshold: formatEther(rawThreshold) }
  } catch (error) {
    console.log('NS: getProposalThreshold error:', error)
    return error
  }
}
