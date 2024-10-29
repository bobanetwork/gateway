import TESTLogo from 'assets/images/test.svg'
import { GATEWAY_DATA_BRANCH, GATEWAY_DATA_RAW } from './constant'

export const getCoinImage = (symbol: string): string => {
  const logoURIbase =
    'https://raw.githubusercontent.com/bobanetwork/token-list/main/assets'
  let url = `${logoURIbase}/${symbol?.toLowerCase()}.svg`

  if (symbol === 'test') {
    url = TESTLogo
  }
  return url
}

export const getEcoImage = (name: string) => {
  return `${GATEWAY_DATA_RAW}${GATEWAY_DATA_BRANCH}/ecosystem/icons/${name}`
}
