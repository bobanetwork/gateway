import { useReadContract, useWriteContract, useSimulateContract } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { stakingContractConfig } from '@/config/contracts';

export function useTokenApproval(address: `0x${string}` | undefined, chainId: number) {
  const { data: tokenAllowance } = useReadContract({
    address: stakingContractConfig.bobaToken[chainId],
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address!, stakingContractConfig.staking.address]
  });

  const { data: approveSimulation, error: approveSimulationError } = useSimulateContract({
    address: stakingContractConfig.bobaToken[chainId],
    abi: erc20Abi,
    functionName: 'approve',
    args: [address!, parseEther('0.001')]
    // enabled: false, /// TODO review whats impact on removal and adding.
  });

  const { writeContractAsync: approveWrite } = useWriteContract();

  return {
    tokenAllowance,
    approveSimulation,
    approveSimulationError,
    approveWrite,
  };
}
