import { type Address } from 'viem'
import { stakingABI } from './abis/stakingABI'


interface ContractConfig {
  address: Address
  abi: typeof stakingABI
}

interface TokenAddresses {
  [chainId: number]: Address
}

interface StakingContracts {
  [chainId: number]: ContractConfig
}

export const stakingContractConfig = {
  staking: {
    1: {
      // "BobaFixedSavings": "0xA9F76f4556044ACE32Af0989A10eB8CF40963128",
      // "Proxy__BobaFixedSavings": "0x9Fb3051148ff6EFCD0B5bA0Afa22EB0B9fC67A69",
      address: '0x9Fb3051148ff6EFCD0B5bA0Afa22EB0B9fC67A69' as Address,
      abi: stakingABI,
    },
    // Add other networks
  } as StakingContracts,

  bobaToken: {
    1: "0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc" as Address,
    // Add other networks
  } as TokenAddresses,
}