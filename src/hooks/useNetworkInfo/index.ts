import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'
import { Network, NetworkType } from 'util/network/network.util'

export const useNetworkInfo = () => {
  const [isAnchorageEnabled, setIsAnchorageEnabled] = useState(false)

  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectActiveNetworkType())

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
  }, [network, networkType])

  return {
    isAnchorageEnabled,
  }
}
