import { StakeInfo } from '@/types/stake'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StakingState {
  selectedStake: StakeInfo
  setSelectedStake: (id: StakeInfo | null) => void
}

export const useStakingStore = create<StakingState>()(
  devtools(
    (set) => ({
      selectedStake: null,
      setSelectedStake: (info: StakeInfo) => set({ selectedStake: info }),
    }),
    {
      name: 'staking-info-store',
    }
  )
)

