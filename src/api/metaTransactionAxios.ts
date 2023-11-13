import axios from 'axios'

export default (networkConfig: any) => {
  const url = networkConfig['META_TRANSACTION']

  const axiosInstance = axios.create({
    baseURL: url,
  })

  axiosInstance.interceptors.request.use((config) => {
    config.headers['Accept'] = 'application/json'
    config.headers['Content-Type'] = 'application/json'
    return config
  })

  return axiosInstance
}
