import { Options } from './types'

export const proposalConfig = {
  'change-threshold': {
    value: (state) => [state.votingThreshold],
    text: '',
  },
  'text-proposal': {
    value: (state) => [],
    text: (state) => `${state.proposeText}@@${state.proposalUri}`,
  },
  'change-lp1-fee': {
    value: (state) => [
      Math.round(Number(state.LPfeeMin) * 10),
      Math.round(Number(state.LPfeeMax) * 10),
      Math.round(Number(state.LPfeeOwn) * 10),
    ],
    text: '',
  },
  'change-lp2-fee': {
    value: (state) => [
      Math.round(Number(state.LPfeeMin) * 10),
      Math.round(Number(state.LPfeeMax) * 10),
      Math.round(Number(state.LPfeeOwn) * 10),
    ],
    text: '',
  },
}

export const options: Options = [
  { value: 'change-threshold', label: 'Change Voting Threshold' },
  { value: 'text-proposal', label: 'Freeform Text Proposal' },
  { value: 'change-lp1-fee', label: 'Change L1 LP fees' },
  { value: 'change-lp2-fee', label: 'Change L2 LP fees' },
]
