import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { addTokenToMetaMask, TokenConfig } from '@/utils/metamask';

import { IconCirclePlus } from '@tabler/icons-react';
import { useAccount } from 'wagmi'; // If you're using wagmi

interface AddToMetaMaskButtonProps {
  tokenConfig: TokenConfig
}

export const AddToMetaMaskButton: React.FC<AddToMetaMaskButtonProps> = ({
  tokenConfig
}) => {
  const { isConnected } = useAccount() // If you're using wagmi

  if (!isConnected) return null

  if (!window.ethereum) return null

  return (
    <Tooltip>
      <TooltipContent>Add to MetaMask</TooltipContent>
      <TooltipTrigger>
        <IconCirclePlus onClick={() => addTokenToMetaMask(tokenConfig)} className="h-4 w-4 text-gray-600 dark:text-dark-gray-50" />
      </TooltipTrigger>
    </Tooltip>
  )
}
