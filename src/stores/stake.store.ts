import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StakingState {
  selectedStakeId: string | null
  setSelectedStakeId: (id: string | null) => void
}

export const useStakingStore = create<StakingState>()(
  devtools(
    (set) => ({
      selectedStakeId: null,
      setSelectedStakeId: (id) => set({ selectedStakeId: id }),
    }),
    {
      name: 'staking-store',
    }
  )
)

