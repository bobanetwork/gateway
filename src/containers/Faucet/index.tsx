import { setConnect } from 'actions/setupAction'
import { Button, Heading, Typography } from 'components/global'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAccountEnabled } from 'selectors'

import styled, { css } from 'styled-components'
import { mobile } from 'themes/screens'
import FaucetTabSelector from './FaucetTabs'

export const FaucetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 500px;
  margin: 32px auto;

  ${mobile(css`
    max-width: 360px;
    margin: 24px auto;
  `)}
`
export const FaucetContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-around;
  align-items: flex-start;
`
export const FaucetAction = styled.div`
  width: 100%;
  display: flex;
  justify-content: around;
  align-items: center;
  margin-top: 24px;
`

type Props = {}

const Faucet = (props: Props) => {
  const dispatch = useDispatch<any>()
  const accountEnabled = useSelector<any>(selectAccountEnabled())

  const onConnect = () => {
    dispatch(setConnect(true))
  }

  const onClaimFaucet = () => {}

  return (
    <FaucetContainer>
      <FaucetContent>
        <Heading variant="h2">Faucet</Heading>
        <Typography variant="body2">Description of faucet</Typography>
        <FaucetTabSelector />
      </FaucetContent>
      <FaucetAction>
        {!accountEnabled ? (
          <Button
            fullWidth
            onClick={onConnect}
            label={<Heading variant="h3"> Connect Wallet</Heading>}
          />
        ) : (
          <Button
            fullWidth
            onClick={onClaimFaucet}
            label={<Heading variant="h3">Bridge</Heading>}
          />
        )}
      </FaucetAction>
    </FaucetContainer>
  )
}

export default Faucet
