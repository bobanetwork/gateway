import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui'
import { addTokenToMetaMask, TokenConfig } from '@/utils/metamask';

import { IconCirclePlus } from '@tabler/icons-react'
import { useAccount } from 'wagmi'; // If you're using wagmi

interface AddToMetaMaskButtonProps {
  tokenConfig: TokenConfig
  className?: string
}

export const AddToMetaMaskButton: React.FC<AddToMetaMaskButtonProps> = ({
  tokenConfig,
  className
}) => {
  const { isConnected } = useAccount() // If you're using wagmi

  if (!isConnected) return null

  if (!window.ethereum) return null

  return (
    <Tooltip>
      <TooltipContent>Add to MetaMask</TooltipContent>
      <TooltipTrigger>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          onClick={() => addTokenToMetaMask(tokenConfig)}
        >
          <IconCirclePlus className="h-4 w-4 text-gray-600 dark:text-dark-gray-50" />
        </Button>
      </TooltipTrigger>
    </Tooltip>
  )
}
