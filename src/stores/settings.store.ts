import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  showTestnet: boolean
  showDestinationAddress: boolean
  setShowTestnet: (value: boolean) => void
  setShowDestinationAddress: (value: boolean) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showTestnet: false,
      showDestinationAddress: false,

      setShowTestnet: (value: boolean) =>
        set({ showTestnet: value }),

      setShowDestinationAddress: (value: boolean) =>
        set({ showDestinationAddress: value }),

      resetSettings: () =>
        set({
          showTestnet: false,
          showDestinationAddress: false
        }),
    }),
    {
      name: 'settings-storage', // unique name for localStorage
    }
  )
)
