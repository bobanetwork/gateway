import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAmountToBridge,
  selectBridgeType,
  selectDestChainIdTeleportation,
  selectL1FeeRateN,
  selectL2FeeRateN,
  selectLayer,
  selectTokenToBridge,
} from 'selectors'
import { toWei_String } from 'util/amountConvert'
import { formatTokenAmount } from 'util/common'
import { LAYER } from 'util/constant'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { CHAIN_ID_LIST } from '../../util/network/network.util'

/**
 * This hook is used for getting receivable amount.
 *
 * @returns receivableAmount
 */

export const useAmountToReceive = () => {
  const dispatch = useDispatch<any>()

  const bridgeType = useSelector(selectBridgeType())
  const amount = useSelector(selectAmountToBridge())
  const token = useSelector(selectTokenToBridge())
  const layer = useSelector(selectLayer())
  const lightBridgeDestChainId = useSelector(selectDestChainIdTeleportation()) // can be L2 <> L2, we don't want a exit fee here
  const l2FeeRateN = useSelector(selectL2FeeRateN)
  const l1FeeRateN = useSelector(selectL1FeeRateN)
  const l1LightBridgeFeeRateN = '1' // static, as only set in backend for now for light bridge when exiting to L1

  const [amountToReceive, setAmountToReceive] = useState<
    string | null | number
  >(0)

  useEffect(() => {
    if (!token) {
      return
    }

    const formatedAmount = () => {
      return formatTokenAmount({
        ...token,
        balance: toWei_String(Number(amount), token.decimals),
      })
    }

    if (layer === LAYER.L1) {
      if (bridgeType === BRIDGE_TYPE.CLASSIC) {
        setAmountToReceive(formatedAmount())
      } else if (bridgeType === BRIDGE_TYPE.FAST) {
        const value = Number(amount) * ((100 - Number(l2FeeRateN)) / 100)
        setAmountToReceive(value.toFixed(3))
      } else {
        // Teleportation, no fees as of now
        setAmountToReceive(amount)
      }
    } else {
      const isLightBridgeExitToL1 =
        (!lightBridgeDestChainId && layer === LAYER.L2) ||
        CHAIN_ID_LIST[lightBridgeDestChainId]?.layer === LAYER.L1
      if (bridgeType === BRIDGE_TYPE.CLASSIC) {
        setAmountToReceive(formatedAmount())
      } else if (bridgeType === BRIDGE_TYPE.FAST) {
        const value = Number(amount) * ((100 - Number(l1FeeRateN)) / 100)
        setAmountToReceive(value.toFixed(3))
      } else if (bridgeType === BRIDGE_TYPE.LIGHT && isLightBridgeExitToL1) {
        // lightbridge exit fee to L1 only
        // const value =
        // Number(amount) * ((100 - Number(l1LightBridgeFeeRateN)) / 100)
        setAmountToReceive(Number(amount).toFixed(4))
      } else {
        // Teleportation, no fees as of now
        setAmountToReceive(amount)
      }
    }
  }, [dispatch, layer, token, amount, bridgeType, l2FeeRateN, l1FeeRateN])

  return {
    amount: `${amountToReceive} ${token?.symbol}`,
  }
}

export default useAmountToReceive
