import verifierWatcherAxiosInstance from 'api/verifierWatcherAxios'
import networkService from './networkService'

class VerifierService {
  /**
   * @getVerifierStatus
   */

  async getVerifierStatus() {
    const watcherInstance = verifierWatcherAxiosInstance(
      networkService.networkConfig
    )

    if (!watcherInstance) {
      return false
    }

    const response = await watcherInstance.post('/', {
      jsonrpc: '2.0',
      method: 'status',
      id: 1,
    })

    if (response.status === 200) {
      return response.data.result
    } else {
      console.warn('VS: Bad verifier response')
      return false
    }
  }
}

const verifierService = new VerifierService()

export default verifierService
