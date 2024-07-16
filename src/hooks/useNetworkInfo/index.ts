import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'
import { Network, NetworkType } from 'util/network/network.util'

export const useNetworkInfo = () => {
  const [isAnchorageEnabled, setIsAnchorageEnabled] = useState(false)
  const [isActiveNetworkBnb, setIsActiveNetworkBnb] = useState(false)

  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectActiveNetworkType())

  useEffect(() => {
    // NOTE: as anchorage has been shiped to ETHEREUM and BNB Testnet only.
    if (
      network === Network.ETHEREUM ||
      (network === Network.BNB && networkType === NetworkType.TESTNET)
    ) {
      setIsAnchorageEnabled(true)
    } else {
      setIsAnchorageEnabled(false)
    }

    if (network === Network.BNB) {
      setIsActiveNetworkBnb(true)
    } else {
      setIsActiveNetworkBnb(false)
    }

    return () => {
      setIsAnchorageEnabled(false)
      setIsActiveNetworkBnb(false)
    }
  }, [network, networkType])

  return {
    isAnchorageEnabled,
    isActiveNetworkBnb,
  }
}
