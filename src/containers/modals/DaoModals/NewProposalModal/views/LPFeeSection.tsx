import React from 'react'
import Input from 'components/input/Input'
import { StyledDescription } from '../styles'

export const LPFeeSection: React.FC<{
  LPfeeMin: string
  setLPfeeMin: (value: string) => void
  LPfeeMax: string
  setLPfeeMax: (value: string) => void
  LPfeeOwn: string
  setLPfeeOwn: (value: string) => void
}> = ({
  LPfeeMin,
  setLPfeeMin,
  LPfeeMax,
  setLPfeeMax,
  LPfeeOwn,
  setLPfeeOwn,
}) => (
  <>
    <StyledDescription>
      Possible settings range from 0.0% to 5.0%. All three values must be
      specified and the maximum fee must be larger than the minimum fee.
    </StyledDescription>
    <Input
      label="New LP minimium fee (%)"
      placeholder="Minimium fee (e.g. 1.0)"
      value={LPfeeMin}
      type="number"
      onChange={(i) => setLPfeeMin(i.target.value)}
      fullWidth
    />
    <Input
      label="New LP maximum fee (%)"
      placeholder="Maximum fee (e.g. 3.0)"
      value={LPfeeMax}
      type="number"
      onChange={(i) => setLPfeeMax(i.target.value)}
      fullWidth
    />
    <Input
      label="New LP operator fee (%)"
      placeholder="Operator fee (e.g. 1.0)"
      value={LPfeeOwn}
      type="number"
      onChange={(i) => setLPfeeOwn(i.target.value)}
      fullWidth
    />
  </>
)
