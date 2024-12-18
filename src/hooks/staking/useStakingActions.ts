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

  // Simulate staking
  const { data: stakeSimulation, error: stakeSimulateError } = useSimulateContract({
    ...stakingContractConfig.staking,
    functionName: 'stake',
    args: [BigInt(1)]
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

  const { tokenAllowance, approveSimulation, approveWrite, approveSimulationError } = useTokenApproval(address, chainId);

  // Action handlers
  const stake = useCallback(async (amount: number) => {
    try {
      if (!address) throw new Error('Wallet not connected')

      if (!approveSimulation) {
        console.log(`ap simulation error`, approveSimulationError)
        throw new Error('Approve Simulation failed')
      }

      if (!stakeSimulation) {
        throw new Error('Stake Simulation failed')
      }
      //TODO: amount need to be in weigh string.
      const amountToStake = parseEther(amount.toString())
      // Add buffer for approval (similar to your original code)
      const approvalBuffer = parseEther('0.000000000001') // 1000000000000 in your original code
      const totalApprovalAmount = amountToStake + approvalBuffer

      // Check if we need to approve
      if (!tokenAllowance || totalApprovalAmount > tokenAllowance) {
        // Approve tokens first
        await approveWrite({
          ...approveSimulation.request,
          address: stakingContractConfig.bobaToken[chainId],
          args: [stakingContractConfig.staking.address, totalApprovalAmount],
        })
        // TODO Wait for approval transaction
        // const approveReceipt = await waitForTransactionReceipt(approveTx)
        // if (!approveReceipt.status) throw new Error('Approval failed')
      }

      console.log(`staking boba!`);

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
    stakeSimulation,
    stakeWrite,
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
