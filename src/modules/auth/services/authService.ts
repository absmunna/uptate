import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return data;
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post(ENDPOINTS.AUTH.REGISTER, data);
    return response;
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};
