import React, { useEffect, useState } from 'react'
import { BridgeInfoContainer, InfoRow } from '../styles'
import { Label } from '../../styles'
import {
  selectBobaFeeChoice,
  selectBobaPriceRatio,
  selectBridgeType,
  selectClassicExitCost,
  selectExitFee,
  selectLayer,
} from 'selectors'
import { useSelector } from 'react-redux'
import { LAYER } from 'util/constant'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import useAmountToReceive from 'hooks/useAmountToReceive'
import networkService from 'services/networkService'
import { useTheme } from 'styled-components'
import { useNetworkInfo } from 'hooks/useNetworkInfo'

interface Props {}

const Fee = (props: Props) => {
  const bridgeType = useSelector(selectBridgeType())
  const layer = useSelector(selectLayer())
  const theme: any = useTheme()

  const classicExitCost = useSelector(selectClassicExitCost)
  const feeUseBoba = useSelector(selectBobaFeeChoice())
  const feePriceRatio = useSelector(selectBobaPriceRatio())
  const exitFee = useSelector(selectExitFee)

  const { isAnchorageEnabled } = useNetworkInfo()

  const { amount: amountToReceive } = useAmountToReceive()

  const [gasFee, setGasFee] = useState('')

  const estimateTime = () => {
    if (isAnchorageEnabled && layer === LAYER.L1) {
      return '~ 3mins'
    } else if (bridgeType === BRIDGE_TYPE.CLASSIC) {
      if (layer === LAYER.L1) {
        return '13 ~ 14mins.'
      } else {
        return '7 days'
      }
    } else {
      // Teleportation, instant
      return '~1min.'
    }
  }

  useEffect(() => {
    if (layer === LAYER.L1) {
      setGasFee(`0 ETH`)
    } else {
      //TODO: add check for safecost to avoid issues. debug why gas estimation wrong
      const cost = classicExitCost || 0

      const safeCost = Number(cost) * 1.04 // 1.04 == safety margin on cost
      if (feeUseBoba) {
        setGasFee(`${Number(safeCost * feePriceRatio).toFixed(4)} BOBA`)
      } else {
        setGasFee(
          `${Number(safeCost).toFixed(4)} ${networkService.L1NativeTokenSymbol}`
        )
      }
    }
  }, [layer, bridgeType, classicExitCost, feeUseBoba, feePriceRatio])
  return (
    <BridgeInfoContainer>
      <InfoRow>
        <Label>Estimated time</Label>
        <Label>{estimateTime()}</Label>
      </InfoRow>
      <InfoRow>
        <Label>Destination gas fee</Label>
        <Label>{gasFee}</Label>
      </InfoRow>
      {!isAnchorageEnabled &&
      layer === LAYER.L2 &&
      bridgeType !== BRIDGE_TYPE.LIGHT ? (
        <InfoRow>
          <Label>xChain Relay Fee</Label>
          <Label>{exitFee} BOBA</Label>
        </InfoRow>
      ) : null}
      <InfoRow>
        <Label
          color={`${
            theme.name === 'light'
              ? theme.colors.gray[800]
              : theme.colors.gray[50]
          }`}
        >
          You will receive
        </Label>
        <Label
          color={`${
            theme.name === 'light'
              ? theme.colors.gray[800]
              : theme.colors.gray[50]
          }`}
        >
          {amountToReceive}
        </Label>
      </InfoRow>
    </BridgeInfoContainer>
  )
}

export default Fee
