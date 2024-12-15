import { Button } from '@/components/ui'
import { useNetworkSwitch } from '@/hooks/useNetworkSwitch'
import { Chain } from 'viem'

import { useAccount } from 'wagmi'
import { NetworkSwitchModal } from '../NetworkSwitchModal'

interface NetworkSwitchButtonProps {
  toNewChain: Chain
  className?: string
  children?: React.ReactNode
}

export const NetworkSwitchButton: React.FC<NetworkSwitchButtonProps> = ({
  toNewChain,
  className,
  children
}) => {
  const { chainId } = useAccount()
  const {
    switchToChain,
    switchState,
    targetChain,
    error,
    isModalOpen,
    confirmSwitch,
    addNetwork,
    closeModal, } = useNetworkSwitch()



  return (
    <>
      <NetworkSwitchModal
        isOpen={isModalOpen}
        onClose={closeModal}
        state={switchState}
        targetChain={targetChain}
        error={error}
        onConfirm={confirmSwitch}
        onAddNetwork={addNetwork}
      />

    <Button
      variant="default"
      className={className}
        onClick={() => switchToChain(toNewChain)}
        disabled={chainId === toNewChain.id}
    >
        {children || `Connect to ${toNewChain.name}`}
    </Button>
    </>
  )
}
