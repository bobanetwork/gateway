import { formatEther } from '@ethersproject/units'
import networkService from './networkService'
import walletService from './wallet.service'
import { utils } from 'ethers'
import { graphQLService } from './graphql.service'

export class DaoService {
  async createProposal(payload) {
    if (
      networkService.L1orL2 !== 'L2' ||
      !networkService.delegateContract ||
      !walletService.account
    ) {
      return
    }

    let signatures = ['']
    let value1 = 0
    let value2 = 0
    let value3 = 0
    let description = ''
    let address = ['']
    let callData = ['']
    // FIXME: Ve DAO From here
    /*
      let tokenIds = payload.tokenIds
      // create proposal only on latest contracts.
      const delegateCheck = await this.delegateContract.attach(this.addresses.GovernorBravoDelegatorV2)

    */
    // FIXME: Ve DAO Till here

    const delegateCheck = await networkService.delegateContract.attach(
      networkService.addresses.GovernorBravoDelegator
    )

    if (payload.action === 'text-proposal') {
      address = ['0x000000000000000000000000000000000000dEaD']
      description = payload.text.slice(0, 252) //100+150+2
      callData = [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      ]
    } else if (payload.action === 'change-lp1-fee') {
      signatures = ['configureFeeExits(uint256,uint256,uint256)']
      value1 = Number(payload.value[0])
      value2 = Number(payload.value[1])
      value3 = Number(payload.value[2])
      description = `Change L1 LP Bridge fee to ${value1}, ${value2}, and ${value3} integer percent`
      address = [networkService.addresses.L2LPAddress]
      callData = [
        utils.defaultAbiCoder.encode(
          ['uint256', 'uint256', 'uint256'],
          [value1, value2, value3]
        ),
      ]
    } else if (payload.action === 'change-lp2-fee') {
      address = [delegateCheck.address]
      signatures = ['configureFee(uint256,uint256,uint256)']
      value1 = Number(payload.value[0])
      value2 = Number(payload.value[1])
      value3 = Number(payload.value[2])
      description = `Change L2 LP Bridge fee to ${value1}, ${value2}, and ${value3} integer percent`
      address = [networkService.addresses.L2LPAddress]
      callData = [
        utils.defaultAbiCoder.encode(
          ['uint256', 'uint256', 'uint256'],
          [value1, value2, value3]
        ),
      ]
    } else if (payload.action === 'change-threshold') {
      address = [delegateCheck.address]
      signatures = ['_setProposalThreshold(uint256)']
      value1 = Number(payload.value[0])
      description = `Change Proposal Threshold to ${value1} BOBA`
      callData = [utils.defaultAbiCoder.encode(['uint256'], [value1])]
    }

    try {
      const values = [0] //amount of ETH to send, generally, zero
      return await delegateCheck
        .connect(walletService.provider!.getSigner())
        .propose(address, values, signatures, callData, description)
    } catch (error) {
      console.log('NS: createProposal error:', error)
      return error
    }
  }

  async getProposalThreshold() {
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

  async fetchDaoBalance() {
    if (!networkService.BobaContract || !walletService.account) {
      return
    }
    try {
      const balance = await networkService.BobaContract!.balanceOf(
        walletService.account
      )
      return { balance: formatEther(balance) }
    } catch (error) {
      console.log('Error: fetchDaoBalance', error)
      return error
    }
  }

  async fetchDaoBalanceX() {
    if (!networkService.xBobaContract || walletService.account) {
      return
    }
    try {
      const balance = await networkService.xBobaContract.balanceOf(
        walletService.account
      )
      return { balanceX: formatEther(balance) }
    } catch (error) {
      console.log('Error: fetchDaoBalanceX', error)
      return error
    }
  }

  async fetchDaoVotes() {
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

  async fetchDaoVotesX() {
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

  async delegateVotes({ recipient }) {
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

  async delegateVotesX({ recipient }) {
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

  async queueProposal(proposalId: string | number) {
    if (!networkService.delegateContract || !walletService.account) {
      return
    }

    try {
      const delegateCheck = networkService.delegateContract
        .connect(walletService.provider!.getSigner())
        .attach(networkService.addresses.GovernorBravoDelegator)
      return delegateCheck.queue(Number(proposalId))
    } catch (error) {
      console.log('NS: queueProposal error:', error)
      return error
    }
  }

  async executeProposal(proposalId: string | number) {
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

  async fetchProposals() {
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

        const againstVotes = parseInt(
          formatEther(proposalData.againstVotes),
          10
        )
        const forVotes = parseInt(formatEther(proposalData.forVotes), 10)
        const abstainVotes = parseInt(
          formatEther(proposalData.abstainVotes),
          10
        )

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

  async castProposalVote({ id, userVote }) {
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
}

const daoService = new DaoService()

export default daoService
