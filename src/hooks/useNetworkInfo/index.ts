import { BRIDGE_TYPE } from 'containers/Bridging/BridgeTypeSelector'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  selectActiveNetwork,
  selectActiveNetworkType,
  selectBridgeType,
  selectLayer,
} from 'selectors'
import { Layer } from 'util/constant'
import { Network, NetworkType } from 'util/network/network.util'

export const useNetworkInfo = () => {
  const [isAnchorageEnabled, setIsAnchorageEnabled] = useState(false)
  const [isClassicWithdrawalDisabled, setIsClassicWithdrawalDisabled] =
    useState(false)

  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectActiveNetworkType())
  const layer = useSelector(selectLayer())
  const bridgeType = useSelector(selectBridgeType())

  useEffect(() => {
    // @todo @note make sure to update based on the anchorage logic update for mainnet release.
    // @todo remove check for sepolia & testnet to release anchorage for mainnet.
    if (
      networkType === NetworkType.TESTNET &&
      network === Network.ETHEREUM_SEPOLIA
    ) {
      setIsAnchorageEnabled(true)
    } else {
      setIsAnchorageEnabled(false)
    }

    // @note disable classic withdrawal for mainnet from Boba ETH.
    // @todo remove check once anchorage update done.
    if (
      networkType === NetworkType.MAINNET &&
      bridgeType === BRIDGE_TYPE.CLASSIC &&
      layer === Layer.L2
    ) {
      setIsClassicWithdrawalDisabled(true)
    } else {
      setIsClassicWithdrawalDisabled(false)
    }
  }, [network, networkType])

  return {
    isAnchorageEnabled,
    isClassicWithdrawalDisabled,
  }
}
