import React from 'react'
import Input from 'components/input/Input'
import { StyledDescription } from '../styles'

export const ThresholdSection: React.FC<{
  votingThreshold: string
  setVotingThreshold: (value: string) => void
}> = ({ votingThreshold, setVotingThreshold }) => (
  <>
    <StyledDescription>
      The minimum number of votes required for an account to create a proposal.
      The current value is {votingThreshold}.
    </StyledDescription>
    <Input
      label="DAO voting threshold"
      placeholder="New voting threshold (e.g. 65000)"
      value={votingThreshold}
      type="number"
      onChange={(i) => setVotingThreshold(i.target.value)}
      fullWidth
      sx={{ marginBottom: '20px' }}
    />
  </>
)
