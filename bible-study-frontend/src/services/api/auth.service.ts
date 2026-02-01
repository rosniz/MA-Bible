import apiClient from './axios.config';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenRefreshRequest,
  TokenRefreshResponse,
  ChangePasswordRequest,
} from '../types/auth.types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/users/login/', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/users/register/', userData);
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    const response = await apiClient.post<TokenRefreshResponse>('/auth/token/refresh/', {
      refresh: refreshToken,
    } as TokenRefreshRequest);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post('/users/change-password/', data);
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};
