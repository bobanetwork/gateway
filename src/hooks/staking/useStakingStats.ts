import { stakingContractConfig } from '@/config/contracts';
import { StakeInfo } from '@/types/stake';
import { publicClientConfig } from '@/wagmi/publicconfig';
import { useQuery } from '@tanstack/react-query';
import { readContract } from '@wagmi/core';
import { useEffect } from 'react';
import { formatEther } from 'viem';
import { useAccount, useChainId, useReadContract } from 'wagmi';


export function useStakingStats() {

  const chainId = useChainId();
  const { address } = useAccount();

  useEffect(() => {
    console.log(`console staking stats`);
  }, [])

  // Fetch stake count for the account
  const { data: stakeCount } = useReadContract({
    address: stakingContractConfig.staking.address,
    abi: stakingContractConfig.staking.abi,
    functionName: 'personalStakeCount',
    args: [address!],
    chainId,
    query: {
      enabled: !!address
    }
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
          address: stakingContractConfig.staking.address,
          abi: stakingContractConfig.staking.abi,
          functionName: 'personalStakePos',
          args: [address, BigInt(i)],
        });
        // Get stake data
        const [, , depositAmount, depositTimestamp, isActive] = await readContract(publicClientConfig, {
          address: stakingContractConfig.staking.address,
          abi: stakingContractConfig.staking.abi,
          functionName: 'stakeDataMap',
          args: [stakeId],
        }) as unknown as any;

        stakeInfo.push({
          stakeId: Number(stakeId),
          depositTimestamp: Number(depositTimestamp),
          depositAmount: formatEther(depositAmount),
          isActive: isActive,
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
    apy: '5.0', // NOTE Predefined const.
    isLoading,
  };
}