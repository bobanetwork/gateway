import { http, createConfig } from '@wagmi/core'
import { boba, bobaSepolia, mainnet, sepolia } from '@wagmi/core/chains'

export const publicClientConfig = createConfig({
  chains: [mainnet, sepolia, boba, bobaSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [boba.id]: http(),
    [bobaSepolia.id]: http(),
  },
})