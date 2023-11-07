import { setConnect } from 'actions/setupAction'
import { openModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectAmountToBridge,
  selectBridgeAlerts,
  selectTokenToBridge,
} from 'selectors'
import { BridgeActionButton, BridgeActionContainer } from '../styles'

const BridgeAction = () => {
  const dispatch = useDispatch<any>()
  const accountEnabled = useSelector<any>(selectAccountEnabled())
  const token = useSelector(selectTokenToBridge())
  const amountToBridge = useSelector(selectAmountToBridge())
  const bridgeAlerts = useSelector(selectBridgeAlerts())

  const isBridgeActionDisabled = () => {
    const hasError = bridgeAlerts.find((alert: any) => alert.type === 'error')
    return !token || !amountToBridge || hasError
  }

  const onConnect = () => {
    dispatch(setConnect(true))
  }

  const onBridge = () => {
    if (!isBridgeActionDisabled()) {
      dispatch(openModal('bridgeConfirmModal'))
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
        <BridgeActionButton
          disable={isBridgeActionDisabled()}
          onClick={onBridge}
          data-testid="bridge-btn"
          label={<Heading variant="h3">Bridge</Heading>}
        />
      )}
    </BridgeActionContainer>
  )
}

export default BridgeAction
