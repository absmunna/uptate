import { safeStorage } from "@/utils/storage";

export const authService = {
  setToken: (token: string) => safeStorage.setItem('pm_token', token),
  getToken: () => safeStorage.getItem('pm_token'),
  clearToken: () => safeStorage.removeItem('pm_token'),
  parseJwt: (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },
};
