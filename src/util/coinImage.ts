import TESTLogo from 'assets/images/test.svg'
import mttLogo from 'assets/images/mtt.svg'

export const getCoinImage = (symbol: string): string => {
  const logoURIbase =
    'https://raw.githubusercontent.com/bobanetwork/token-list/main/assets'
  let url = `${logoURIbase}/${symbol?.toLowerCase()}.svg`

  if (symbol === 'test') {
    url = TESTLogo
  }
  if (['mtt', 'MTT'].includes(symbol)) {
    url = mttLogo
  }
  return url
}
