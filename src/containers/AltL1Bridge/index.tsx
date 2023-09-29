import { fetchBalances, fetchLookUpPrice } from 'actions/networkAction'
import { setConnectBOBA, setConnectETH } from 'actions/setupAction'
import { Button, IconLabel, Typography } from 'components/global'
import { CheckboxWithLabel } from 'components/global/checkbox'
import {
  BridgeTabs,
  BridgeTabItem,
} from 'containers/Bridging/BridgeTypeSelector/style'
import Connect from 'containers/connect'
import { isEqual } from 'util/lodash'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectActiveNetwork,
  selectActiveNetworkName,
  selectBaseEnabled,
  selectLayer,
  selectLoading,
  selectLookupPrice,
  selectTokens,
  selectlayer1Balance,
  selectlayer2Balance,
} from 'selectors'
import networkService from 'services/networkService'
import styled, { css } from 'styled-components'
import { sdesktop } from 'themes/screens'
import { amountToUsd, logAmount } from 'util/amountConvert'
import BN from 'bn.js'

export const AltL1BridgeContainer = styled.div`
  margin: 0px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
  padding-top: 0;
  width: 100%;
  max-width: 1024px;
  min-width: 480px;
  ${sdesktop(css`
    max-width: 750px;
    gap: 0px 30px;
  `)}
`

export const AltBridgeActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30%;
  margin-bottom: 10px;
`
export const AltBridgeAction = styled.div`
  justify-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 300px;
`

export const TokenListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`
export const TokenListHead = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  marigin-top: 20px;
  border-radius: 12px;
  border: 1px solid var(--gray-300, #545454);
  background: var(
    --glass-bg-popup,
    linear-gradient(
      129deg,
      rgba(48, 48, 48, 0.7) 0%,
      rgba(48, 48, 48, 0.7) 46.35%,
      rgba(37, 37, 37, 0.7) 94.51%
    )
  );
  box-shadow: 0px 2px 17px 0px rgba(0, 0, 0, 0.15);
`
export const TokenListBody = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  marigin-top: 10px;
  border-radius: 12px;
  border: 1px solid var(--gray-300, #545454);
  background: var(
    --glass-bg-popup,
    linear-gradient(
      129deg,
      rgba(48, 48, 48, 0.7) 0%,
      rgba(48, 48, 48, 0.7) 46.35%,
      rgba(37, 37, 37, 0.7) 94.51%
    )
  );
  box-shadow: 0px 2px 17px 0px rgba(0, 0, 0, 0.15);
`
export const ListBodyItem = styled.div`
  width: calc(25% - 5px);
`

export const ListHeadItem = styled(Typography).attrs({
  variant: 'body1',
})`
  width: calc(25% - 5px);
`

const TokenList = ({ token, showBalanceToken }) => {
  const { name, symbol, address, decimals } = token

  const lookupPrice = useSelector(selectLookupPrice)

  const amountInNumber =
    token.symbol === 'ETH'
      ? Number(logAmount(token.balance, token.decimals, 3))
      : Number(logAmount(token.balance, token.decimals, 2))

  const amount =
    token.symbol === 'ETH'
      ? Number(logAmount(token.balance, token.decimals, 3)).toLocaleString(
          undefined,
          { minimumFractionDigits: 3, maximumFractionDigits: 3 }
        )
      : Number(logAmount(token.balance, token.decimals, 2)).toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )

  if (showBalanceToken && token.balance.lte(new BN(1000000))) {
    return null
  }

  return (
    <TokenListBody>
      <ListBodyItem>
        <IconLabel
          token={{
            name,
            symbol,
            address,
            decimals,
          }}
        />
      </ListBodyItem>
      <ListBodyItem>{amount}</ListBodyItem>
      <ListBodyItem>
        {`$${amountToUsd(amountInNumber, lookupPrice, token).toFixed(2)}`}
      </ListBodyItem>
      <ListBodyItem>
        {token.symbol === 'BOBA' ? (
          <Button
            onClick={() => {
              console.log('on bridge!!')
            }}
            label={'Bridge to alt L1'}
            small
          />
        ) : null}
      </ListBodyItem>
    </TokenListBody>
  )
}
const AltL1Bridge: FC = () => {
  const dispatch = useDispatch<any>()
  const layer = useSelector(selectLayer())
  const accountEnabled = useSelector(selectAccountEnabled())
  const baseEnabled = useSelector(selectBaseEnabled())
  const networkName = useSelector(selectActiveNetworkName())
  const [showMyTokens, setShowMyTokens] = useState(false)

  const tokenList = useSelector(selectTokens)

  const l2Balance = useSelector(selectlayer2Balance, isEqual)
  const l1Balance = useSelector(selectlayer1Balance, isEqual)

  const depositLoading = useSelector(selectLoading(['DEPOSIT/CREATE']))
  const exitLoading = useSelector(selectLoading(['EXIT/CREATE']))
  const balanceLoading = useSelector(selectLoading(['BALANCE/GET']))

  useEffect(() => {
    if (accountEnabled) {
      dispatch(fetchBalances())
    }
  }, [dispatch, accountEnabled])

  const getLookupPrice = useCallback(() => {
    if (!accountEnabled) {
      return
    }
    // only run once all the tokens have been added to the tokenList
    if (Object.keys(tokenList).length < networkService.tokenAddresses?.length) {
      return
    }

    const symbolList = Object.values(tokenList).map((i: any) => {
      if (i.symbolL1 === 'ETH') {
        return 'ethereum'
      } else if (i.symbolL1 === 'OMG') {
        return 'omg'
      } else if (i.symbolL1 === 'BOBA') {
        return 'boba-network'
      } else if (i.symbolL1 === 'OLO') {
        return 'oolongswap'
      } else if (i.symbolL1 === 'USDC') {
        return 'usd-coin'
      } else if (i.symbolL1 === 'AVAX') {
        return 'avalanche-2'
      } else if (i.symbolL1 === 'FTM') {
        return 'fantom'
      } else if (['BNB', 'tBNB'].includes(i.symbolL1)) {
        return 'binancecoin'
      } else if (['DEV', 'GLMR'].includes(i.symbolL1)) {
        return 'moonbeam'
      } else {
        return i.symbolL1.toLowerCase()
      }
    })
    dispatch(fetchLookUpPrice(symbolList))
  }, [tokenList, dispatch, accountEnabled])

  useEffect(() => {
    if (!baseEnabled) {
      return
    }
    getLookupPrice()
  }, [getLookupPrice, baseEnabled])

  return (
    <AltL1BridgeContainer>
      <Connect
        userPrompt={
          'Connect to MetaMask to see your balances, transfer, and bridge'
        }
        accountEnabled={accountEnabled}
        layer="L2"
      />

      {accountEnabled && (
        <div>
          <AltBridgeActionContainer>
            <BridgeTabs>
              <BridgeTabItem
                active={layer === 'L1'}
                onClick={() => {
                  dispatch(setConnectETH(true))
                }}
              >
                {networkName['l1']} wallet
              </BridgeTabItem>
              <BridgeTabItem
                active={layer === 'L2'}
                onClick={() => {
                  dispatch(setConnectBOBA(true))
                }}
              >
                {networkName['l2']} wallet
              </BridgeTabItem>
            </BridgeTabs>
            <AltBridgeAction>
              <CheckboxWithLabel
                label="My tokens Only"
                checked={showMyTokens}
                onChange={(status) => setShowMyTokens(status)}
              />
            </AltBridgeAction>
          </AltBridgeActionContainer>

          <TokenListContainer>
            <TokenListHead>
              <ListHeadItem>Tokens</ListHeadItem>
              <ListHeadItem>Amount</ListHeadItem>
              <ListHeadItem>Value</ListHeadItem>
              <ListHeadItem>Actions</ListHeadItem>
            </TokenListHead>
            {balanceLoading ? `Loading Balances for ${layer}` : ``}
            {layer === 'L1'
              ? (l1Balance as any[]).map((i: any) => (
                  <TokenList
                    showBalanceToken={showMyTokens}
                    key={i.symbol}
                    token={i}
                  />
                ))
              : null}
            {layer === 'L2'
              ? (l2Balance as any[]).map((i: any) => (
                  <TokenList
                    showBalanceToken={showMyTokens}
                    key={i.symbol}
                    token={i}
                  />
                ))
              : null}
          </TokenListContainer>
        </div>
      )}
    </AltL1BridgeContainer>
  )
}

export default AltL1Bridge
