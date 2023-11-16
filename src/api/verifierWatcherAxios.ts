import axios from 'axios'

export default (networkConfig) => {
  const url = networkConfig['VERIFIER_WATCHER_URL']

  if (!url) {
    return null
  }

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
