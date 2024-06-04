import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAccountEnabled, selectTokens } from 'selectors'
import networkService from 'services/networkService'

const useLookupPrice = () => {
  const [lookupPrice, setlookupPrice] = useState({})
  const dispatch = useDispatch<any>()
  const isAccountEnabled = useSelector(selectAccountEnabled())
  const tokenList = useSelector(selectTokens)

  useEffect(() => {
    if (!isAccountEnabled) {
      return
    }
    const fetchTokenPrice = async () => {
      if (
        Object.keys(tokenList)?.length < networkService.supportedTokens?.length
      ) {
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
          return i?.symbolL1?.toLowerCase() ?? ''
        }
      })
      const prices = await networkService.fetchLookUpPrice(symbolList)
      console.log(`prices`, prices)
      setlookupPrice(prices)
    }
    fetchTokenPrice()
  }, [tokenList, dispatch, isAccountEnabled])

  return {
    lookupPrice,
  }
}

export default useLookupPrice
