import { IThirdPartyBridge } from 'containers/Bridging/ThirdPartyBridges/types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectActiveNetworkType } from 'selectors'
import { loadThirdPartyBridges } from 'services/data.service'
import { NetworkType } from 'util/network/network.util'

interface IBridgeResponse<Data> {
  bridges: Data | null
  loading: boolean
  error: string | null
}

const useThirdPartyBridges = <T>(): IBridgeResponse<T> => {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [bridges, setBridges] = useState<T | null>(null)

  const networkType = useSelector(selectActiveNetworkType())

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const response = await loadThirdPartyBridges()
        if (isMounted) {
          setBridges(response)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (networkType !== NetworkType.TESTNET) {
      loadData()
    }

    return () => {
      isMounted = false
    }
  }, [networkType])

  return {
    error,
    loading,
    bridges,
  }
}

export default useThirdPartyBridges
