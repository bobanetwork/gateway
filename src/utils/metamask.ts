import { toast } from "@/hooks/useToast"


export interface TokenConfig {
  address: string
  symbol: string
  decimals: number
}

export const addTokenToMetaMask = async (tokenConfig: TokenConfig) => {
  try {
    const wasAdded = await (window.ethereum as any).request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenConfig.address,
          symbol: tokenConfig.symbol,
          decimals: tokenConfig.decimals
        },
      },
    })

    if (wasAdded) {
      toast({
        title: "Success",
        description: `${tokenConfig.symbol} token was added to MetaMask`,
      })
    }
    return wasAdded
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to add token to MetaMask",
      variant: "destructive"
    })
    return false
  }
}
