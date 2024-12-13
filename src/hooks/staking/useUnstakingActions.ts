import { useCallback } from 'react'
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { stakingContractConfig } from '@/config/contracts'

export function useStaking() {
  const { address } = useAccount()
  const chainId = useChainId()

  // Simulate unstaking
  const { data: unstakeSimulation, error: unstakeSimulateError } = useSimulateContract({
    ...stakingContractConfig.staking[chainId],
    functionName: 'unstake',
    args: [0], // Placeholder, replace with actual stakeId
  })

  const {
    writeContractAsync: unstakeWrite,
    data: unstakeTxHash,
    isPending: isUnstaking,
    error: unstakeError
  } = useWriteContract()

  const {
    isLoading: isUnstakePending,
    isSuccess: isUnstakeSuccess
  } = useWaitForTransactionReceipt({
    hash: unstakeTxHash,
  })

  const unstake = useCallback(async (stakeId: number) => {
    try {
      if (!address) throw new Error('Wallet not connected')
      if (!unstakeSimulation) throw new Error('Simulation failed')

      const tx = await unstakeWrite({
        ...unstakeSimulation.request,
        args: [stakeId],
      })
      return tx
    } catch (error) {
      console.error('Unstaking error:', error)
      throw error
    }
  }, [unstakeWrite, unstakeSimulation, address])

  return {
    // Loading states
    isUnstaking: isUnstaking || isUnstakePending,

    // Transaction states
    isUnstakeSuccess,
    unstakeTxHash,

    // Errors
    unstakeError: unstakeSimulateError || unstakeError,

    // Actions
    unstake,
  }
}
