import networkService from 'services/networkService'
import { graphQLService } from 'services/graphql.service'
import { formatEther } from '@ethersproject/units'

export const FetchProposal = async () => {
  if (!networkService.delegateContract) {
    return
  }

  const delegateCheck = networkService.delegateContract.attach(
    networkService.addresses.GovernorBravoDelegator
  )

  try {
    const proposalList: any = []

    const proposalCounts = await delegateCheck.proposalCount()
    const totalProposals = await proposalCounts.toNumber()

    /// @notice An event emitted when a new proposal is created
    // event ProposalCreated(uint id, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, uint startTimestamp, uint endTimestamp, string description);
    const L2ChainId = networkService.networkConfig!.L2.chainId
    const descriptionList = await graphQLService.queryBridgeProposalCreated({
      sourceChainId: L2ChainId,
    })

    if (!descriptionList || !descriptionList.data) {
      return { proposalList }
    }

    for (let i = 0; i < totalProposals; i++) {
      const proposalRaw = descriptionList!.data.governorProposalCreateds[i]

      if (typeof proposalRaw === 'undefined') {
        continue
      }

      const proposalID = proposalRaw.proposalId

      //this is a number such as 2
      const proposalData = await delegateCheck.proposals(proposalID)

      const proposalStates = [
        'Pending',
        'Active',
        'Canceled',
        'Defeated',
        'Succeeded',
        'Queued',
        'Expired',
        'Executed',
      ]

      const state = await delegateCheck.state(proposalID)

      const againstVotes = parseInt(formatEther(proposalData.againstVotes), 10)
      const forVotes = parseInt(formatEther(proposalData.forVotes), 10)
      const abstainVotes = parseInt(formatEther(proposalData.abstainVotes), 10)

      const startTimestamp = proposalData.startTimestamp.toString()
      const endTimestamp = proposalData.endTimestamp.toString()

      const proposal = await delegateCheck.getActions(i + 2)

      const hasVoted = null

      const description = proposalRaw.description.toString()

      proposalList.push({
        id: proposalID?.toString(),
        proposal,
        description,
        totalVotes: forVotes + againstVotes,
        forVotes,
        againstVotes,
        abstainVotes,
        state: proposalStates[state],
        startTimestamp,
        endTimestamp,
        hasVoted,
      })
    }
    return { proposalList }
  } catch (error) {
    console.log('NS: fetchProposals error:', error)
    return error
  }
}
