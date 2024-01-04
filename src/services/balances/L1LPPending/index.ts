import { BigNumber } from 'ethers'
import omgxWatcherAxiosInstance from 'api/omgxWatcherAxios'
import networkService from 'services/networkService'

export const L1LPPending = async (tokenAddress: string): Promise<string> => {
  const L1pending = await omgxWatcherAxiosInstance(
    networkService.networkConfig
  ).get('get.l2.pendingexits', {})

  const pendingFast = L1pending.data.filter((i) => {
    return (
      i.fastRelay === 1 &&
      i.exitToken.toLowerCase() === tokenAddress.toLowerCase()
    )
  })

  const sum = pendingFast.reduce((prev, current) => {
    const weiString = BigNumber.from(current.exitAmount)
    return prev.add(weiString)
  }, BigNumber.from('0'))

  return sum.toString()
}
