import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { safeStorage } from "@/utils/storage";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return data;
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
    return response;
  },
  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post(`${ENDPOINTS.AUTH.LOGIN.replace('/login', '/forgot-password')}`, { email });
    return data;
  },
  getMe: async (): Promise<{ user: any }> => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
  logout: () => {
    safeStorage.removeItem('accessToken');
    safeStorage.removeItem('refreshToken');
  }
};
