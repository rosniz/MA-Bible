import apiClient from './axios.config';
import {
  UserProfile,
  UpdateProfileRequest,
} from '../types/user.types';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/users/profile/');
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.patch<UserProfile>('/users/profile/', data);
    return response.data;
  },
};
