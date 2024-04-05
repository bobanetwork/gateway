/*
  Varna - A Privacy-Preserving Marketplace
  Varna uses Fully Homomorphic Encryption to make markets fair. 
  Copyright (C) 2021 Enya Inc. Palo Alto, CA

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import networkService from 'services/networkService'
import { createAction } from './createAction'

export const fetchDaoBalance = () =>
  createAction('BALANCE/DAO/GET', () => networkService.getDaoBalance())

export const fetchDaoVotes = () =>
  createAction('VOTES/DAO/GET', () => networkService.getDaoVotes())

export const fetchDaoBalanceX = () =>
  createAction('BALANCEX/DAO/GET', () => networkService.getDaoBalanceX())

export const fetchDaoVotesX = () =>
  createAction('VOTESX/DAO/GET', () => networkService.getDaoVotesX())

export const delegateVotes = ({ recipient }) =>
  createAction('DELEGATE/VOTES/CREATE', () =>
    networkService.delegateVotes({ recipient })
  )

export const delegateVotesX = ({ recipient }) =>
  createAction('DELEGATEX/VOTES/CREATE', () =>
    networkService.delegateVotesX({ recipient })
  )

export const getProposalThreshold = () =>
  createAction('PROPOSALTHRESHOLD/GET', () =>
    networkService.getProposalThreshold()
  )

export const fetchDaoProposals = () =>
  createAction('PROPOSALS/GET', () => networkService.fetchProposals())

export const createDaoProposal = (payload) =>
  createAction('PROPOSAL/CREATE', () => networkService.createProposal(payload))

export const queueProposal = (proposalID) =>
  createAction('PROPOSAL/QUEUE', () => networkService.queueProposal(proposalID))

export const executeProposal = (proposalID) =>
  createAction('PROPOSAL/EXECUTE', () =>
    networkService.executeProposal(proposalID)
  )

export const castProposalVote = (payload) =>
  createAction('PROPOSAL/CAST/VOTE', () =>
    networkService.castProposalVote(payload)
  )
