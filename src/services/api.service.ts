import _coinGeckoAxiosInstance from 'api/coinGeckoAxios'

export class ApiService {
  async fetchTokenPriceInUsd(params: Array<string>) {
    try {
      const res = await _coinGeckoAxiosInstance.get(
        `simple/price?ids=${params.join()}&vs_currencies=usd`
      )
      return res.data
    } catch (error) {
      return error
    }
  }
}

const apiService = new ApiService()
export default apiService
