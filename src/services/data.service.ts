import axios from 'axios'
import { THIRD_PARTY_BRIDGES_LIST } from 'util/constant'

export const loadThirdPartyBridges = async () => {
  try {
    const response = await axios.get(THIRD_PARTY_BRIDGES_LIST)
    return response.data
  } catch (error) {
    throw error
  }
}
