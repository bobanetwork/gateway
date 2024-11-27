import { setConnect } from 'actions/setupAction'
import { openModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectActiveNetworkType,
  selectAmountToBridge,
  selectBridgeAlerts,
  selectTokenToBridge,
} from 'selectors'
import { BridgeActionButton, BridgeActionContainer } from '../styles'
import { ONRAMP_API_KEY, PURCHASE_RAMP_URL } from 'util/constant'
import { NetworkType } from 'util/network/network.util'
import { trackClick } from 'util/analytics'

const BridgeAction = () => {
  const dispatch = useDispatch<any>()
  const accountEnabled = useSelector<any>(selectAccountEnabled())
  const token = useSelector(selectTokenToBridge())
  const amountToBridge = useSelector(selectAmountToBridge())
  const bridgeAlerts = useSelector(selectBridgeAlerts())

  const isMainnet =
    useSelector(selectActiveNetworkType()) === NetworkType.MAINNET

  const isBridgeActionDisabled = () => {
    const hasError = bridgeAlerts.find((alert: any) => alert.type === 'error')
    return !token || !amountToBridge || hasError
  }

  const onConnect = () => {
    dispatch(setConnect(true))
  }

  const onBridge = () => {
    if (!isBridgeActionDisabled()) {
      dispatch(openModal({ modal: 'bridgeConfirmModal' }))
    }
  }

  return (
    <BridgeActionContainer>
      {!accountEnabled ? (
        <BridgeActionButton
          onClick={onConnect}
          data-testid="connect-btn"
          label={<Heading variant="h3">Connect Wallet</Heading>}
        />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '10px',
          }}
        >
          <BridgeActionButton
            disabled={isBridgeActionDisabled()}
            onClick={onBridge}
            data-testid="bridge-btn"
            label={<Heading variant="h3">Bridge</Heading>}
          />
          {isMainnet && ONRAMP_API_KEY ? (
            <BridgeActionButton
              outline
              onClick={() => {
                trackClick('button', 'button_click', 'Buy With Ramp Network')
                window.open(PURCHASE_RAMP_URL, 'blank')
              }}
              data-testid="connect-btn"
              label={<Heading variant="h3">Buy with Ramp Network</Heading>}
            />
          ) : null}
        </div>
      )}
    </BridgeActionContainer>
  )
}

export default BridgeAction
