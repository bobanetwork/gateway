import axios from 'axios'
// TODO: remove once BNB migrated to anchorage.
export default (networkConfig) => {
  const watcherUrl = networkConfig['OMGX_WATCHER_URL']

  const axiosInstance = axios.create({
    baseURL: watcherUrl,
  })

  axiosInstance.interceptors.request.use((config) => {
    config.headers['Accept'] = 'application/json'
    config.headers['Content-Type'] = 'application/json'
    return config
  })

  return axiosInstance
}
