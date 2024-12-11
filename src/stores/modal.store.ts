import { create } from 'zustand';

interface ModalState {
  modals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isOpen: (id: string) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: {},
  openModal: (id: string) =>
    set((state) => ({
      modals: { ...state.modals, [id]: true },
    })),
  closeModal: (id: string) =>
    set((state) => {
      const { [id]: _, ...rest } = state.modals;
      return { modals: rest };
    }),
  closeAllModals: () => set(() => ({ modals: {} })),
  isOpen: (id: string) => !!get().modals[id],
}));
