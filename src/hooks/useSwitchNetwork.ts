import { useCallback } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { Chain } from 'wagmi/chains'

export const useSwitchNetwork = () => {
  const { chain: currentChain } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  const switchToChain = useCallback(async (targetChain: Chain) => {
    if (!switchChainAsync) {
      // Handle case where switching is not available
      console.error('Network switching not available')
      return false
    }

    try {
      await switchChainAsync({ chainId: targetChain.id as any })
      return true
    } catch (error) {
      console.error('Failed to switch network:', error)
      return false
    }
  }, [switchChainAsync])

  return {
    currentChain,
    switchToChain
  }
}
