import {
  fetchClassicExitCost,
  fetchExitFee,
  fetchL2BalanceBOBA,
  fetchL2BalanceETH,
} from 'actions/balanceAction'
import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAccountEnabled,
  selectBridgeType,
  selectLayer,
  selectTokenToBridge,
} from 'selectors'
import networkService from 'services/networkService'
import { LAYER } from 'util/constant'
import { setBlockTime } from '../../actions/setupAction'

const useBridgeSetup = () => {
  const dispatch = useDispatch<any>()
  const isAccountEnabled = useSelector(selectAccountEnabled())
  const layer = useSelector(selectLayer())
  const bridgeType = useSelector(selectBridgeType())
  const token = useSelector(selectTokenToBridge())

  useEffect(() => {
    if (layer === LAYER.L2 && token) {
      dispatch(fetchL2BalanceETH())
      dispatch(fetchL2BalanceBOBA())
      dispatch(fetchExitFee())

      if (bridgeType === BRIDGE_TYPE.CLASSIC) {
        // fetching details for classic Exits
        dispatch(fetchClassicExitCost(token.address))
      }

      return () => {
        dispatch({ type: 'BALANCE/L1/RESET' })
      }
    }
  }, [layer, token, bridgeType, dispatch])

  useEffect(() => {
    if (isAccountEnabled) {
      if (bridgeType === BRIDGE_TYPE.LIGHT) {
        networkService.getLatestBlockTime().then((blockTime) => {
          if (!blockTime) {
            return
          }
          dispatch(setBlockTime(blockTime))
        })
      }
    }
  }, [isAccountEnabled, bridgeType])
}

export default useBridgeSetup
