import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetwork, selectActiveNetworkType } from 'selectors'
import { Network, NetworkType } from 'util/network/network.util'

const useAppConfig = () => {
  const [doesFruadProofWithdrawalEnable, setDoesFruadProofWithdrawalEnable] =
    useState<boolean>(false)

  const network = useSelector(selectActiveNetwork())
  const networkType = useSelector(selectActiveNetworkType())

  useEffect(() => {
    if (network === Network.ETHEREUM && networkType === NetworkType.TESTNET) {
      setDoesFruadProofWithdrawalEnable(true)
    } else {
      setDoesFruadProofWithdrawalEnable(false)
    }
  }, [network, networkType])

  return {
    doesFruadProofWithdrawalEnable,
  }
}

export default useAppConfig
