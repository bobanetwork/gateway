import { NetworkSwitchState } from '@/types/network'
import { useCallback, useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { Chain } from 'wagmi/chains'

export const useNetworkSwitch = () => {
  const { chain: currentChain } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const [switchState, setSwitchState] = useState<NetworkSwitchState>('idle')
  const [targetChain, setTargetChain] = useState<Chain | undefined>()
  const [error, setError] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleError = (error: any) => {
    console.error('Failed to switch network:', error)
    // Check if error is related to chain not being added
    if (error?.code === 4902) { // Metamask chain not added error code
      setSwitchState('chain-not-found')
    } else {
      setSwitchState('failed')
      setError(error?.message || 'Something went wrong')
    }
  }

  const switchToChain = useCallback(async (newTargetChain: Chain) => {
    if (!switchChainAsync) {
      console.error('Network switching not available')
      return false
    }

    setTargetChain(newTargetChain)
    setSwitchState('confirming')
    setIsModalOpen(true)
    return true
  }, [switchChainAsync])

  const confirmSwitch = async () => {
    if (!targetChain || !switchChainAsync) {
      console.log(`no target or switch chain async`)
      return
    }

    try {
      setSwitchState('switching')
      await switchChainAsync({ chainId: targetChain.id as any })
      setSwitchState('success')
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const addNetwork = async () => {
    if (!targetChain) return

    try {
      // TODO: make use viem method 
      // TODO: make sure wallet add chain works for other wallets or disable function if not supported.
      // https://viem.sh/docs/actions/wallet/addChain#chain
      // Implementation depends on your wallet provider
      // Example for MetaMask:
      await (window.ethereum as any)?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${targetChain.id.toString(16)}`,
            chainName: targetChain.name,
            nativeCurrency: targetChain.nativeCurrency,
            rpcUrls: [targetChain.rpcUrls.default.http[0]],
            blockExplorerUrls: [targetChain.blockExplorers?.default.url],
          },
        ],
      })
      // After adding, try switching again
      await confirmSwitch()
    } catch (error) {
      handleError(error)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSwitchState('idle')
    setError('')
    setTargetChain(undefined)
  }

  return {
    currentChain,
    switchToChain,
    switchState,
    targetChain,
    error,
    isModalOpen,
    confirmSwitch,
    addNetwork,
    closeModal,
  }
}
