import { formatEther } from 'viem'

// For non-blockchain API calls or data transformations
export const stakingService = {
  // Example of a non-blockchain service method
  async getStakingStats() {
    // const response = await fetch('/api/staking/stats')
    // return response.json()
  },

  // Helper functions for data formatting
  formatStakingData(rawAmount: bigint) {
    return formatEther(rawAmount)
  },

  calculateRewards(stakedAmount: bigint, apy: bigint) {
    // Custom reward calculation logic
    return formatEther(stakedAmount * apy / 10000n)
  }
}