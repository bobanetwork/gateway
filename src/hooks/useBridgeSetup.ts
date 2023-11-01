import {
  fetchL2LPBalance,
  fetchL2LPLiquidity,
  fetchL2LPPending,
  fetchL2TotalFeeRate,
  fetchL2FeeRateN,
  fetchL1FeeBalance,
  fetchClassicExitCost,
  fetchExitFee,
  fetchL2BalanceBOBA,
  fetchL2BalanceETH,
  fetchL1FeeRateN,
  fetchL1LPBalance,
  fetchL1LPLiquidity,
  fetchL1LPPending,
  fetchL1TotalFeeRate,
} from 'actions/balanceAction'
import { clearLookupPrice, fetchLookUpPrice } from 'actions/networkAction'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectBridgeType,
  selectLayer,
  selectTokenToBridge,
  selectTokens,
} from 'selectors'
import networkService from 'services/networkService'
import { LAYER } from 'util/constant'

const useBridgeSetup = () => {
  const dispatch = useDispatch<any>()
  const isAccountEnabled = useSelector(selectAccountEnabled())
  const tokenList = useSelector(selectTokens)
  const layer = useSelector(selectLayer())
  const bridgeType = useSelector(selectBridgeType())
  const token = useSelector(selectTokenToBridge())
  useEffect(() => {
    if (bridgeType === BRIDGE_TYPE.LIGHT) {
      // Teleportation
      // TODO: Load required info
    }

    if (layer === LAYER.L2 && token) {
      dispatch(fetchL2BalanceETH())
      dispatch(fetchL2BalanceBOBA())
      dispatch(fetchExitFee())

      if (bridgeType === BRIDGE_TYPE.CLASSIC) {
        dispatch(fetchClassicExitCost(token.address))
      }

      return () => {
        dispatch({ type: 'BALANCE/L1/RESET' })
      }
    }
  }, [layer, token, bridgeType, dispatch])

  const getLookupPrice = useCallback(() => {
    if (!isAccountEnabled) {
      return
    }
    // TODO: refactor and make sure to triggered this once all the tokens are
    // // only run once all the tokens have been added to the tokenList
    if (Object.keys(tokenList).length < networkService.supportedTokens.length) {
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
      } else {
        return i.symbolL1.toLowerCase()
      }
    })

    dispatch(fetchLookUpPrice(symbolList))
  }, [tokenList, dispatch, isAccountEnabled])

  useEffect(() => {
    if (isAccountEnabled) {
      getLookupPrice()
    }

    return () => {
      dispatch(clearLookupPrice())
    }
  }, [getLookupPrice, isAccountEnabled])
}

export default useBridgeSetup
