import { stakingContractConfig } from '@/config/contracts';
import { StakeInfo } from '@/types/stake';
import { publicClientConfig } from '@/wagmi/publicconfig';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { formatEther } from 'viem';
import { useAccount, useChainId, useReadContract } from 'wagmi';


export function useStakingStats() {
  const chainId = useChainId();
  const { address } = useAccount();

  // Fetch stake count for the account
  const { data: stakeCount } = useReadContract({
    address: stakingContractConfig.staking[chainId].address,
    abi: stakingContractConfig.staking[chainId].abi,
    functionName: 'personalStakeCount',
    args: [address!]
  });

  // Use React Query to manage the staking history data
  const { data: stakingHistory, isLoading } = useQuery({
    queryKey: ['stakingHistory', address, chainId],
    queryFn: async (): Promise<StakeInfo[]> => {
      if (!address || !stakeCount) return [];
      const stakeInfo: StakeInfo[] = [];
      const count = Number(stakeCount);

      for (let i = 0; i < count; i++) {
        // Get stake ID
        const stakeId = await readContract(publicClientConfig, {
          address: stakingContractConfig.staking[chainId].address,
          abi: stakingContractConfig.staking[chainId].abi,
          functionName: 'personalStakePos',
          args: [address, BigInt(i)],
        });

        // Get stake data
        const stakeData = await readContract(publicClientConfig, {
          address: stakingContractConfig.staking[chainId].address,
          abi: stakingContractConfig.staking[chainId].abi,
          functionName: 'stakeDataMap',
          args: [stakeId],
        }) as unknown as any;

        stakeInfo.push({
          stakeId: Number(stakeId),
          depositTimestamp: Number(stakeData.depositTimestamp),
          depositAmount: formatEther(stakeData.depositAmount),
          isActive: stakeData.isActive,
        });
      }

      return stakeInfo;
    },
    enabled: Boolean(address && stakeCount),
  });

  // Calculate total staked amount
  const totalStaked = stakingHistory?.reduce((acc, stake) => {
    if (stake.isActive) {
      return acc + Number(stake.depositAmount);
    }
    return acc;
  }, 0);

  return {
    stakingHistory: stakingHistory || [],
    totalStaked: totalStaked?.toString() || '0',
    apy: '5.0%', // TODO: move to constants.
    isLoading,
  };
}