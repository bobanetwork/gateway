import { graphQLService } from '@bobanetwork/graphql-utils'
import { Contract } from 'ethers'
import { defaultAbiCoder, formatEther } from 'ethers/lib/utils'
import { BOBAABI, GovernorBravoDelegateABI } from 'services/abi'
import { L2_SECONDARYFEETOKEN_ADDRESS } from 'services/app.service'
import networkService from 'services/networkService'
import { ERROR_CODE } from 'util/constant'
import { Network, NetworkType } from 'util/network/network.util'

class DaoService {
  loadBobaTokenContract() {
    let l2SecondaryFeeTokenAddress = L2_SECONDARYFEETOKEN_ADDRESS
    if (
      networkService.tokenAddresses &&
      Network.ETHEREUM === networkService.network
    ) {
      l2SecondaryFeeTokenAddress = networkService.tokenAddresses.BOBA.L2
    }

    return new Contract(
      l2SecondaryFeeTokenAddress,
      BOBAABI,
      networkService.L2Provider
    )
  }

  loadXBobaTokenContract() {
    let xBobaTokenAddress = ''
    if (
      networkService.tokenAddresses &&
      Network.ETHEREUM === networkService.network &&
      NetworkType.MAINNET === networkService.networkType
    ) {
      xBobaTokenAddress = networkService.tokenAddresses.xBOBA.L2
    }

    if (!xBobaTokenAddress) {
      throw new Error(`${ERROR_CODE} invalid xBoba token address`)
    }
    return new Contract(xBobaTokenAddress, BOBAABI, networkService.L2Provider)
  }

  loadDelegatorContract() {
    if (!networkService.addresses.GovernorBravoDelegator) {
      throw new Error(`${ERROR_CODE} invalid GovernorBravoDelegator Address`)
    }
    return new Contract(
      networkService.addresses.GovernorBravoDelegator,
      GovernorBravoDelegateABI,
      networkService.L2Provider
    )
  }

  checkWalletConnection() {
    if (!networkService.account) {
      throw new Error(`${ERROR_CODE} wallet not connected!`)
    }
  }

  async loadBobaBalance() {
    try {
      this.checkWalletConnection()
      const bobaContract = this.loadBobaTokenContract()
      const balance = await bobaContract.balanceOf(networkService.account)
      return { balance: formatEther(balance) }
    } catch (error) {
      return error
    }
  }
  async loadXBobaBalance() {
    try {
      this.checkWalletConnection()

      const xBobaContract = this.loadXBobaTokenContract()

      const balance = await xBobaContract.balanceOf(networkService.account)
      return { balanceX: formatEther(balance) }
    } catch (error) {
      return error
    }
  }

  async loadBobaVotes() {
    try {
      this.checkWalletConnection()
      const bobaContract = this.loadBobaTokenContract()
      const votes = await bobaContract.getCurrentVotes(networkService.account)
      return { votes: formatEther(votes) }
    } catch (error) {
      return error
    }
  }

  async loadXBobaVotes() {
    try {
      this.checkWalletConnection()
      const bobaContract = this.loadXBobaTokenContract()
      const votes = await bobaContract.getCurrentVotes(networkService.account)
      return { votesX: formatEther(votes) }
    } catch (error) {
      return error
    }
  }

  async delegateBobaVotes({ recipient }: { recipient: string }) {
    try {
      // TODO: verify if check for layer L2 needed.
      this.checkWalletConnection()
      const contract = this.loadBobaTokenContract()
      const tx = await contract
        .connect(networkService.provider!.getSigner())
        .delegate(recipient)
      await tx.wait()
      return tx
    } catch (error) {
      return error
    }
  }

  async delegateXBobaVotes({ recipient }: { recipient: string }) {
    try {
      this.checkWalletConnection()
      const contract = this.loadXBobaTokenContract()
      const tx = await contract
        .connect(networkService.provider!.getSigner())
        .delegate(recipient)
      await tx.wait()
      return tx
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async loadProposalThreshold() {
    try {
      this.checkWalletConnection()
      const contract = this.loadDelegatorContract()
      const rawThreshold = await contract.proposalThreshold()
      return { proposalThreshold: formatEther(rawThreshold) }
    } catch (error) {
      return error
    }
  }

  // TODO: instead of calling load proposal on timeinterval, attach listener.
  async loadProposals() {
    try {
      this.checkWalletConnection()
      const contract = this.loadDelegatorContract()
      const proposalList: any = []
      const proposalCounts = await contract.proposalCount()
      const totalProposals = await proposalCounts.toNumber()

      /// @notice An event emitted when a new proposal is created
      // event ProposalCreated(uint id, address proposer, address[] targets, uint[] values, string[] signatures, bytes[] calldatas, uint startTimestamp, uint endTimestamp, string description);
      const L2ChainId = networkService.networkConfig!.L2.chainId
      const descriptionList = await graphQLService.queryBridgeProposalCreated({
        sourceChainId: L2ChainId,
      })

      for (let i = 0; i < totalProposals; i++) {
        const proposalRaw = descriptionList!.data.proposalCreateds[i]

        if (typeof proposalRaw === 'undefined') {
          continue
        }

        const proposalID = proposalRaw.idParam
        const proposalData = await contract.proposals(proposalID)

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

        const state = await contract.state(proposalID)

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

        const proposal = await contract.getActions(i + 2)

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
      return error
    }
  }

  async createProposal(payload: any) {
    try {
      this.checkWalletConnection()
      let signatures = ['']
      let value1 = 0
      let value2 = 0
      let value3 = 0
      let description = ''
      let address = ['']
      let callData = ['']

      const delegateCheck = this.loadDelegatorContract()

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
          defaultAbiCoder.encode(
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
          defaultAbiCoder.encode(
            ['uint256', 'uint256', 'uint256'],
            [value1, value2, value3]
          ),
        ]
      } else if (payload.action === 'change-threshold') {
        address = [delegateCheck.address]
        signatures = ['_setProposalThreshold(uint256)']
        value1 = Number(payload.value[0])
        description = `Change Proposal Threshold to ${value1} BOBA`
        callData = [defaultAbiCoder.encode(['uint256'], [value1])]
      }
      // TODO: should return or throw error incase no action matches.
      const values = [0] // amount of ETH to send, generally, zero
      return await delegateCheck
        .connect(networkService.provider!.getSigner())
        .propose(address, values, signatures, callData, description)
    } catch (error) {
      return error
    }
  }

  async queueProposal(proposalID) {
    try {
      this.checkWalletConnection()
      const contract = this.loadDelegatorContract()

      return await contract
        .connect(networkService.provider!.getSigner())
        .queue(Number(proposalID))
    } catch (error) {
      return error
    }
  }

  async executeProposal(proposalID) {
    try {
      this.checkWalletConnection()
      const contract = this.loadDelegatorContract()

      return await contract
        .connect(networkService.provider!.getSigner())
        .execute(Number(proposalID))
    } catch (error) {
      return error
    }
  }

  async castVote({ id, userVote }) {
    try {
      this.checkWalletConnection()
      const contract = this.loadDelegatorContract()
      return await contract
        .connect(networkService.provider!.getSigner())
        .castVote(id, userVote)
    } catch (error) {
      return error
    }
  }
}

const daoService = new DaoService()
export default daoService
