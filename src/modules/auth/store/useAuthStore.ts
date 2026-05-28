import { create } from 'zustand';
import { AuthState, User } from '../../../types/auth';
import { safeStorage } from '../../../utils/storage';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: safeStorage.getItem('pm_token'),
  isAuthenticated: !!safeStorage.getItem('pm_token'),
  login: (user: User, token: string) => {
    safeStorage.setItem('pm_token', token);
    set({ user, token, isAuthenticated: true });
  },
  register: (user: User, token: string) => {
    safeStorage.setItem('pm_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    safeStorage.removeItem('pm_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
