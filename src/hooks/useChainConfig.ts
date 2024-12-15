import { CHAIN_CONFIGS, ChainConfig } from '@/config/chains'
import { useAccount } from 'wagmi'

export const useChainConfig = () => {
  const { chain } = useAccount()

  const chainConfig: ChainConfig | undefined = chain
    ? CHAIN_CONFIGS[chain.id]
    : undefined

  return {
    chainConfig,
    isStakingEnabled: chainConfig?.stakingEnabled ?? false,
    isTestnet: chainConfig?.isTestnet ?? false,
    chainType: chainConfig?.type
  }
}
