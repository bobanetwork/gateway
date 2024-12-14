import { type Address, type Abi, parseAbi } from 'viem'
import { stakingABI } from './abis/stakingABI'


interface ContractConfig {
  address: Address
  abi: Abi
}

interface TokenAddresses {
  [chainId: number]: Address
}

export const stakingContractConfig = {
  staking: {
    address: '0x9fb3051148ff6efcd0b5ba0afa22eb0b9fc67a69' as Address,
    abi: parseAbi(stakingABI),
  } as ContractConfig,

  bobaToken: {
    1: "0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc" as Address,
    288: "0xa18bf3994c0cc6e3b63ac420308e5383f53120d7" as Address,
    // Add other networks
  } as TokenAddresses,
}