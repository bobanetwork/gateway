import { Typography } from 'components/global'
import React, { FC } from 'react'
import { ReactSVG } from 'react-svg'
import styled, { keyframes } from 'styled-components'
import spinnerSvg from 'assets/spinner.svg'

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  aling-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  margin: auto;
`
const LoaderText = styled(Typography).attrs({
  variant: 'h1',
})`
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.36px;
  text-align: left;
  color: ${({ theme: { name, colors } }) =>
    name === 'light' ? colors.gray[800] : colors.gray[100]};
`

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

//@ts-ignore
const RotatingStyledSVG = styled(ReactSVG)`
  fill: var(--teal-800, #0e7d84);
  animation-name: ${spin};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const FallbackLoader: FC = () => {
  return (
    <LoaderContainer>
      <RotatingStyledSVG src={spinnerSvg} />
      <LoaderText>Please wait a moment...</LoaderText>
    </LoaderContainer>
  )
}

export default FallbackLoader
