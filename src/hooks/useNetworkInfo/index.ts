import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'
import { Network, NetworkType } from 'util/network/network.util'

export const useNetworkInfo = () => {
  const [isSepoliaNetwork, setisSepoliaNetwork] = useState(false)

  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectActiveNetworkType())

  useEffect(() => {
    if (
      networkType === NetworkType.TESTNET &&
      network === Network.ETHEREUM_SEPOLIA
    ) {
      setisSepoliaNetwork(true)
    } else {
      setisSepoliaNetwork(false)
    }
  }, [network, networkType])

  return {
    isSepoliaNetwork,
  }
}
