import { stakingContractConfig } from '@/config/contracts'
import { useCallback } from 'react'
import { parseEther } from 'viem'
import {
  useAccount,
  useChainId,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { useTokenApproval } from '../useTokenApproval'

export function useStakingActions() {
  const { address } = useAccount()
  const chainId = useChainId()

  const { tokenAllowance, approveSimulation, approveWrite } = useTokenApproval(address, chainId)

  // Simulate staking
  const { data: stakeSimulation, error: stakeSimulateError } = useSimulateContract({
    ...stakingContractConfig.staking,
    functionName: 'stake'
  })

  const {
    writeContractAsync: stakeWrite,
    data: stakeTxHash,
    isPending: isStaking,
    error: stakeError
  } = useWriteContract()

  const {
    isLoading: isStakePending,
    isSuccess: isStakeSuccess
  } = useWaitForTransactionReceipt({
    hash: stakeTxHash,
  })

  // Action handlers
  const stake = useCallback(async (amount: string) => {
    try {
      if (!address) throw new Error('Wallet not connected')
      if (!approveSimulation || !stakeSimulation) throw new Error('Simulation failed')

      const amountToStake = parseEther(amount)
      // Add buffer for approval (similar to your original code)
      const approvalBuffer = parseEther('0.000000000001') // 1000000000000 in your original code
      const totalApprovalAmount = amountToStake + approvalBuffer

      // Check if we need to approve
      if (!tokenAllowance || totalApprovalAmount > tokenAllowance) {
        // Approve tokens first
        const approveTx = await approveWrite({
          ...approveSimulation.request,
          address: stakingContractConfig.bobaToken[chainId],
          args: [stakingContractConfig.staking.address, totalApprovalAmount],
        })
        console.log(approveTx);
        // TODO Wait for approval transaction
        // const approveReceipt = await waitForTransactionReceipt(approveTx)
        // if (!approveReceipt.status) throw new Error('Approval failed')
      }

      console.log(`processding with staking!`);

      // Proceed with staking
      const stakeTx = await stakeWrite({
        ...stakeSimulation.request,
        args: [amountToStake],
      })

      return stakeTx
    } catch (error) {
      console.error('Staking error:', error)
      throw error
    }
  }, [
    address,
    chainId,
    approveSimulation,
    stakeSimulation,
    approveWrite,
    stakeWrite,
    tokenAllowance,
  ])

  return {
    // loading flag
    isStaking: isStaking || isStakePending,
    // Transaction states
    isStakeSuccess,
    stakeTxHash,
    // Errors
    stakeError: stakeSimulateError || stakeError,
    // Actions
    stake,
  }
}
