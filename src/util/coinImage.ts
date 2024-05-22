import TESTLogo from 'assets/images/test.svg'

export const getCoinImage = (symbol: string): string => {
  const logoURIbase =
    'https://raw.githubusercontent.com/bobanetwork/token-list/main/assets'
  let url = `${logoURIbase}/${symbol?.toLowerCase()}.svg`

  if (symbol === 'test') {
    url = TESTLogo
  }
  return url
}
