import { useReadContract, useWriteContract, useSimulateContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { stakingContractConfig } from '@/config/contracts';

export function useTokenApproval(address: `0x${string}` | undefined, chainId: number) {
  const { data: tokenAllowance } = useReadContract({
    address: stakingContractConfig.bobaToken[chainId],
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address!, stakingContractConfig.staking[chainId].address]
  });

  const { data: approveSimulation } = useSimulateContract({
    address: stakingContractConfig.bobaToken[chainId],
    abi: erc20Abi,
    functionName: 'approve',
    // enabled: false, /// TODO review whats impact on removal and adding.
  });

  const { writeContractAsync: approveWrite } = useWriteContract();

  return {
    tokenAllowance,
    approveSimulation,
    approveWrite,
  };
}
