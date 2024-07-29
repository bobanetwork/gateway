import _coinGeckoAxiosInstance from 'api/coinGeckoAxios'

// fetching only the prices compare to usd
export const fetchLookUpPrice = async (params: string[]) => {
  try {
    const res = await _coinGeckoAxiosInstance.get(
      `simple/price?ids=${params.join()}&vs_currencies=usd`
    )
    return res.data
  } catch (error) {
    console.log(`error while fetching price!`, error)
    return error
  }
}
