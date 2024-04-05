import axios from 'axios'
import { COIN_GECKO_URL } from 'util/constant'

const _coinGeckoAxiosInstance = axios.create({
  baseURL: COIN_GECKO_URL,
})

_coinGeckoAxiosInstance.interceptors.request.use((config) => {
  config.headers['Accept'] = 'application/json'
  config.headers['Content-Type'] = 'application/json'
  return config
})

export default _coinGeckoAxiosInstance
