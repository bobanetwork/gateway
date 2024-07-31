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

import { createAction } from './createAction'

import daoService from 'services/dao/dao.service'

export const fetchDaoBalance = () =>
  createAction('BALANCE/DAO/GET', () => daoService.loadBobaBalance())

export const fetchDaoVotes = () =>
  createAction('VOTES/DAO/GET', () => daoService.loadBobaVotes())

export const fetchDaoBalanceX = () =>
  createAction('BALANCEX/DAO/GET', () => daoService.loadXBobaBalance())

export const fetchDaoVotesX = () =>
  createAction('VOTESX/DAO/GET', () => daoService.loadXBobaVotes())

export const delegateVotes = ({ recipient }) =>
  createAction('DELEGATE/VOTES/CREATE', () =>
    daoService.delegateBobaVotes({ recipient })
  )

export const delegateVotesX = ({ recipient }) =>
  createAction('DELEGATEX/VOTES/CREATE', () =>
    daoService.delegateXBobaVotes({ recipient })
  )

export const getProposalThreshold = () =>
  createAction('PROPOSALTHRESHOLD/GET', () =>
    daoService.loadProposalThreshold()
  )

export const fetchDaoProposals = () =>
  createAction('PROPOSALS/GET', () => daoService.loadProposals())

export const createDaoProposal = (payload) =>
  createAction('PROPOSAL/CREATE', () => daoService.createProposal(payload))

export const queueProposal = (proposalID) =>
  createAction('PROPOSAL/QUEUE', () => daoService.queueProposal(proposalID))

export const executeProposal = (proposalID) =>
  createAction('PROPOSAL/EXECUTE', () => daoService.executeProposal(proposalID))

export const castProposalVote = (payload) =>
  createAction('PROPOSAL/CAST/VOTE', () => daoService.castVote(payload))
