import { Button } from '@/components/ui'
import { useNetworkSwitch } from '@/hooks/useNetworkSwitch'
import { Chain } from 'viem'

import { useAppKit } from '@reown/appkit/react'
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
  const { chainId, isConnected } = useAccount()
  const { open } = useAppKit()
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
        onClick={() => {
          if (isConnected) {
            switchToChain(toNewChain)
          } else {
            open()
          }
        }}
        disabled={chainId === toNewChain.id}
      >
        {children || `Connect to ${toNewChain.name}`}
      </Button>
    </>
  )
}
