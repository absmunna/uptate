import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;
  theme: 'deepDark' | 'colourful' | 'nakshiLight' | 'greenField';
  isScrolled: boolean;
  
  toggleMobileMenu: () => void;
  setSearchModalOpen: (open: boolean) => void;
  setTheme: (theme: any) => void;
  setIsScrolled: (scrolled: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchModalOpen: false,
  theme: 'deepDark',
  isScrolled: false,
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setSearchModalOpen: (open) => set({ isSearchModalOpen: open }),
  setTheme: (theme) => set({ theme }),
  setIsScrolled: (scrolled) => set({ isScrolled: scrolled }),
}));
