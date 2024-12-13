import { useAccount, useBalance, useChainId } from 'wagmi';
import { stakingContractConfig } from '../config/contracts';

// NOTE: default will return boba balance.
// Make it configurable to fetch the balance for other tokens.
export function useBalances() {
  const { address } = useAccount()
  const chainId = useChainId()

  const { data: bobaBalance, isLoading: isLoadingBoba } = useBalance({
    address,
    token: stakingContractConfig.bobaToken[chainId],
  });

  return {
    bobaBalance,
    isLoading: isLoadingBoba,
  };
}