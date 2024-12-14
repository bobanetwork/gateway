import {
  useAccount,
  useReadContract,
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useBalance,
  useChainId,
} from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { stakingContractConfig } from '../config/contracts'
import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { stakingService } from '../services/staking'
import { erc20Abi } from 'viem'

export function useStaking() {
  const { address } = useAccount()
  const chainId = useChainId()

  // Balance hooks
  const { data: bobaBalance, isLoading: isLoadingBoba } = useBalance({
    address,
    token: stakingContractConfig.bobaToken[chainId],
  })

  const { data: stakedAmount, isLoading: isLoadingStaked } = useReadContract({
    ...stakingContractConfig.staking[chainId],
    functionName: 'stakedBalance',
    args: [address!]
  })
  console.log(`stakeAmount`, stakedAmount);

  const { data: apy, isLoading: isLoadingApy } = useReadContract({
    ...stakingContractConfig.staking[chainId],
    functionName: 'getCurrentAPY',
  })

  // Get token allowance
  const { data: tokenAllowance } = useReadContract({
    address: stakingContractConfig.bobaToken[chainId],
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address!, stakingContractConfig.staking[chainId].address]
  })

  // Simulate token approval
  const { data: approveSimulation } = useSimulateContract({
    address: stakingContractConfig.bobaToken[chainId],
    abi: erc20Abi,
    functionName: 'approve'
  })

  // Write contract hooks for approval
  const {
    writeContractAsync: approveWrite,
    data: approveTxHash,
    isPending: isApproving,
  } = useWriteContract()

  const {
    isLoading: isApprovePending,
    isSuccess: isApproveSuccess
  } = useWaitForTransactionReceipt({
    hash: approveTxHash,
  })

  // Simulate staking
  const { data: stakeSimulation, error: stakeSimulateError } = useSimulateContract({
    ...stakingContractConfig.staking[chainId],
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

  // Simulate unstaking
  const { data: unstakeSimulation, error: unstakeSimulateError } = useSimulateContract({
    ...stakingContractConfig.staking[chainId],
    functionName: 'unstake',
    args: ['0'], // Placeholder, replace with actual stakeId
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

  // React Query for non-blockchain data
  const { data: stakingStats } = useQuery({
    queryKey: ['staking', 'stats'],
    queryFn: stakingService.getStakingStats,
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
          args: [stakingContractConfig.staking[chainId].address, totalApprovalAmount],
        })
        console.log(approveTx);
        // TODO Wait for approval transaction
        // const approveReceipt = await waitForTransactionReceipt(approveTx)
        // if (!approveReceipt.status) throw new Error('Approval failed')
      }

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

  const unstake = useCallback(async (stakeId: string) => {
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
    // Balances
    bobaBalance: bobaBalance ? formatEther(bobaBalance.value) : '0',
    stakedAmount: stakedAmount ? stakedAmount : '0',
    apy: apy ? (Number(apy) / 100).toFixed(2) : '0',

    // Loading states
    isLoading: isLoadingBoba || isLoadingStaked || isLoadingApy,
    isStaking: isStaking || isStakePending,
    isUnstaking: isUnstaking || isUnstakePending,

    // Transaction states
    isStakeSuccess,
    isUnstakeSuccess,
    stakeTxHash,
    unstakeTxHash,

    // Errors
    stakeError: stakeSimulateError || stakeError,
    unstakeError: unstakeSimulateError || unstakeError,

    // Actions
    stake,
    unstake,

    // Additional data
    stakingStats,

    // Approval states
    isApproving: isApproving || isApprovePending,
    isApproveSuccess,
    tokenAllowance,
  }
}
