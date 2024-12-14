import { useAccount, useBalance, useChainId } from 'wagmi';
import { stakingContractConfig } from '../config/contracts';
import { formatEther } from 'viem';

// NOTE: default will return boba balance.
// Make it configurable to fetch the balance for other tokens.
export function useBalances() {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data: tokenBalance, isLoading: isLoadingBoba } = useBalance({
    address,
    token: stakingContractConfig.bobaToken[chainId],
  });

  return {
    tokenBalance: tokenBalance ? formatEther(tokenBalance.value) : '0',
    tokenDecimals: tokenBalance ? tokenBalance.decimals : 18,
    isLoading: isLoadingBoba,
  };
}