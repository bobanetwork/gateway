import { stakingContractConfig } from '@/config/contracts'
import { useCallback } from 'react'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

export function useUnstakingActions() {
  const { address } = useAccount()

  // Simulate unstaking
  const { data: unstakeSimulation, error: unstakeSimulateError } = useSimulateContract({
    ...stakingContractConfig.staking,
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
      return tx;
    } catch (error) {
      console.error('UnStaking error:', error)
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
