import axios from 'axios'
import { loadThirdPartyBridges } from './data.service'
import { THIRD_PARTY_BRIDGES_LIST } from 'util/constant'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('loadThirdPartyBridges', () => {
  it('Fetch Should return third Load party bridges', async () => {
    const data = THIRD_PARTY_BRIDGES_LIST

    mockedAxios.get.mockResolvedValue({ data })

    await expect(loadThirdPartyBridges()).resolves.toEqual(data)
  })

  it('Fetch error catch error', async () => {
    const errorMessage = 'An error occurred'
    const error = new Error(errorMessage)

    mockedAxios.get.mockRejectedValue(error)

    await expect(loadThirdPartyBridges()).rejects.toThrow(errorMessage)
  })
})
