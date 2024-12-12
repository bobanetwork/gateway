import { formatEther, parseEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'

export function useStaking() {
  const { address } = useAccount()

  const { data: bobaBalance } = useBalance({
    address,
    token: '0xboba...' // BOBA token address
  })

  // const { data: stakedAmount } = useContractRead({
  //   address: '0xstaking...',
  //   abi: stakingABI,
  //   functionName: 'stakedBalance',
  //   args: [address]
  // })

  // const { data: apy } = useContractRead({
  //   address: '0xstaking...',
  //   abi: stakingABI,
  //   functionName: 'getCurrentAPY'
  // })

  // const { writeAsync: stake } = useContractWrite({
  //   address: '0xstaking...',
  //   abi: stakingABI,
  //   functionName: 'stake'
  // })

  // const { writeAsync: unstake } = useContractWrite({
  //   address: '0xstaking...',
  //   abi: stakingABI,
  //   functionName: 'unstake'
  // })

  return {
    bobaBalance: '9899.02',
    xBobaBalance: '2.024',
    apy: '5.22',
    stakedAmount: '2.0022',
    stake: (amount: string) => console.log("stake ", amount),
    unstake: (stakeId: string) => console.log("unstake ", stakeId)
  }
}

