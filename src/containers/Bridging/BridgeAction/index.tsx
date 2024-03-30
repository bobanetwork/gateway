import { setConnect } from 'actions/setupAction'
import { openModal } from 'actions/uiAction'
import { Heading } from 'components/global'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectAmountToBridge,
  selectBridgeAlerts,
  selectBridgeType,
  selectLayer,
  selectTokenToBridge,
} from 'selectors'
import { BridgeActionButton, BridgeActionContainer } from '../styles'
import { BRIDGE_TYPE } from '../BridgeTypeSelector'
import { Layer } from 'util/constant'

const BridgeAction = () => {
  const dispatch = useDispatch<any>()
  const accountEnabled = useSelector<any>(selectAccountEnabled())
  const token = useSelector(selectTokenToBridge())
  const amountToBridge = useSelector(selectAmountToBridge())
  const bridgeAlerts = useSelector(selectBridgeAlerts())
  const bridgeType = useSelector(selectBridgeType())
  const layer = useSelector(selectLayer())

  const isBridgeActionDisabled = () => {
    // NOTE: temporarily disable classic withdrawal till 16th april
    // change back once anchorage update is done.
    if (bridgeType === BRIDGE_TYPE.CLASSIC && layer === Layer.L2) {
      return true
    }
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
          disabled={isBridgeActionDisabled()}
          onClick={onBridge}
          data-testid="bridge-btn"
          label={<Heading variant="h3">Bridge</Heading>}
        />
      )}
    </BridgeActionContainer>
  )
}

export default BridgeAction
