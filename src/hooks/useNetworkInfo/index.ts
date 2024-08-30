import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'
import { Network, NetworkType } from 'util/network/network.util'

export const useNetworkInfo = () => {
  const [isAnchorageEnabled, setIsAnchorageEnabled] = useState(false)
  const [isActiveNetworkBnb, setIsActiveNetworkBnb] = useState(false)
  const [isActiveNetworkSepolia, setIsActiveNetworkSepolia] = useState(false)
  const [isActiveNetworkBnbTestnet, setIsActiveNetworkBnbTestnet] =
    useState(false)

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

    if (network === Network.ETHEREUM && networkType === networkType.TESTNET) {
      setIsActiveNetworkSepolia(true)
    } else {
      setIsActiveNetworkSepolia(false)
    }
    if (network === Network.BNB && networkType === NetworkType.TESTNET) {
      setIsActiveNetworkBnbTestnet(true)
    } else {
      setIsActiveNetworkBnbTestnet(false)
    }

    if (network === Network.BNB && networkType === NetworkType.MAINNET) {
      setIsActiveNetworkBnb(true)
    } else {
      setIsActiveNetworkBnb(false)
    }
  }, [network, networkType])

  return {
    isAnchorageEnabled,
    isActiveNetworkBnb,
    isActiveNetworkSepolia,
    isActiveNetworkBnbTestnet,
  }
}
