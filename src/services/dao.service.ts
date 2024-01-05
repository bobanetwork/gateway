import { formatEther } from '@ethersproject/units'
import networkService from './networkService'
import walletService from './wallet.service'
import { graphQLService } from './graphql.service'
import {
  CreateProposal,
  ProposalThreshold,
  FetchDaoBalance,
  FetchDaoBalanceX,
  FetchDaoVotes,
  FetchDaoVotesX,
  DelegateVotes,
  DelegateVotesX,
  QueueProposal,
  ExecuteProposal,
  FetchProposal,
  CastProposalVote,
} from './dao'
export class DaoService {
  createProposal = async (payload) => CreateProposal(payload)
  getProposalThreshold = async () => ProposalThreshold()
  fetchDaoBalance = async () => FetchDaoBalance()
  fetchDaoBalanceX = async () => FetchDaoBalanceX()
  fetchDaoVotes = async () => FetchDaoVotes()
  fetchDaoVotesX = async () => FetchDaoVotesX()
  delegateVotes = async ({ recipient }) => DelegateVotes({ recipient })
  delegateVotesX = async ({ recipient }) => DelegateVotesX({ recipient })
  queueProposal = async (proposalId: string | number) =>
    QueueProposal(proposalId)
  executeProposal = async (proposalId: string | number) =>
    ExecuteProposal(proposalId)
  fetchProposals = async () => FetchProposal()
  castProposalVote = async ({ id, userVote }) =>
    CastProposalVote({ id, userVote })
}

const daoService = new DaoService()

export default daoService
