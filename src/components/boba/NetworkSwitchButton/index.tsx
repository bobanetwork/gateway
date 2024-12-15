import { Button } from '@/components/ui'
import { useNetworkSwitch } from '@/hooks/useSwitchNetwork'
import { Chain } from 'viem'

import { useAccount } from 'wagmi'

interface NetworkSwitchButtonProps {
  targetChain: Chain
  className?: string
  children?: React.ReactNode
}

export const NetworkSwitchButton: React.FC<NetworkSwitchButtonProps> = ({
  targetChain,
  className,
  children
}) => {
  const { chainId } = useAccount()
  const { switchToChain } = useNetworkSwitch()

  return (
    <Button
      variant="default"
      className={className}
      onClick={() => switchToChain(targetChain)}
      disabled={chainId === targetChain.id}
    >
      {children || `Connect to ${targetChain.name}`}
    </Button>
  )
}
