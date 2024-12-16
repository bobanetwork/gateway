import { BOBABNB_CHAIN } from '@/config/chainConfig/bobaBnb'
import { BobaBNBTestnet_Chain } from '@/config/chainConfig/bobaBnbTestnet'
import { http, createConfig } from '@wagmi/core'
import { boba, bobaSepolia, mainnet, sepolia } from '@wagmi/core/chains'

export const publicClientConfig = createConfig({
  chains: [mainnet, sepolia, boba, bobaSepolia, BOBABNB_CHAIN, BobaBNBTestnet_Chain],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [boba.id]: http(),
    [bobaSepolia.id]: http(),
    [BOBABNB_CHAIN.id]: http(),
    [BobaBNBTestnet_Chain.id]: http(),
  },
})