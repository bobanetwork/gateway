/*
Copyright 2021-present Boba Network.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

export function selectLPfeeMax(state) {
    return state.dao.LPfeeMax
}

export function selectLPfeeMin(state) {
    return state.dao.LPfeeMin
}

export function selectLPfeeOwn(state) {
    return state.dao.LPfeeOwn
}

export function selectDaoTokens(state) {
    return state.dao.tokens
}

export function selectVotingThreshold(state) {
    return state.dao.votingThreshold
}

export function selectErrorText(state) {
    return state.dao.errorText
}

export function selectProposeText(state) {
    return state.dao.proposeText
}

export function selectProposalUri(state) {
    return state.dao.proposalUri
}

export function selectAction(state) {
    return state.dao.action
}

export function selectSelectedAction(state) {
    return state.dao.selectedAction
}

export function selectDaoLoading(state) {
    return state.dao.loading
}

export function selectDaoBalance(state) {
    return state.dao.balance
}

export function selectDaoVotes(state) {
    return state.dao.votes
}

export function selectDaoBalanceX(state) {
    return state.dao.balanceX
}

export function selectDaoVotesX(state) {
    return state.dao.votesX
}

export function selectProposals(state) {
    return state.dao.proposalList
}

export function selectProposalThreshold(state) {
    return state.dao.proposalThreshold
}
