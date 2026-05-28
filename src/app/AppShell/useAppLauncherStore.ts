import { create } from 'zustand';

interface AppLauncherState {
  isOpen: boolean;
  openLauncher: () => void;
  closeLauncher: () => void;
  toggleLauncher: () => void;
}

export const useAppLauncherStore = create<AppLauncherState>((set) => ({
  isOpen: false,
  openLauncher: () => set({ isOpen: true }),
  closeLauncher: () => set({ isOpen: false }),
  toggleLauncher: () => set((state) => ({ isOpen: !state.isOpen })),
}));
