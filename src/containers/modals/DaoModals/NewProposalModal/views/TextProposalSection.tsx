import React from 'react'
import Input from 'components/input/Input'
import { StyledDescription } from '../styles'

export const TextProposalSection: React.FC<{
  proposeText: string
  setProposeText: (value: string) => void
  proposalUri: string
  setProposalUri: (value: string) => void
}> = ({ proposeText, setProposeText, proposalUri, setProposalUri }) => (
  <>
    <StyledDescription>
      Your proposal title is limited to 100 characters. Use the link field below
      to provide more information.
    </StyledDescription>
    <Input
      placeholder="Title (<100 characters)"
      value={proposeText}
      onChange={(i) => setProposeText(i.target.value.slice(0, 100))}
    />
    <StyledDescription>
      You should provide additional information (technical specifications,
      diagrams, forum threads, and other material) on a separate website. The
      link length is limited to 150 characters. You may need to use a link
      shortener.
    </StyledDescription>
    <Input
      placeholder="URI, https://..."
      value={proposalUri}
      onChange={(i) => setProposalUri(i.target.value.slice(0, 150))}
    />
  </>
)
