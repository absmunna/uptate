import { create } from 'zustand';

type Theme = 'dark' | 'midnight' | 'forest' | 'sunset' | 'colourful' | 'nakshiLight' | 'greenField';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const themes: { id: Theme; name: string }[] = [
  { id: 'dark', name: 'Dark' },
  { id: 'midnight', name: 'Midnight' },
  { id: 'forest', name: 'Forest' },
  { id: 'sunset', name: 'Sunset' },
  { id: 'colourful', name: 'Colourful' },
  { id: 'nakshiLight', name: 'Nakshi Light' },
  { id: 'greenField', name: 'Green Field' }
];

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('pm-theme') as Theme) || 'midnight',
  setTheme: (theme) => {
    localStorage.setItem('pm-theme', theme);
    set({ theme });
    
    // Apply theme
    document.documentElement.classList.remove('dark', 'midnight', 'forest', 'sunset', 'colourful', 'nakshiLight', 'greenField');
    document.documentElement.classList.add(theme);
  },
  toggleTheme: () => {}, // Disabled
}));

// Initialize theme
if (typeof window !== 'undefined') {
  const currentTheme = (localStorage.getItem('pm-theme') as Theme) || 'midnight';
  document.documentElement.classList.remove('dark', 'midnight', 'forest', 'sunset', 'colourful', 'nakshiLight', 'greenField');
  document.documentElement.classList.add(currentTheme);
}
