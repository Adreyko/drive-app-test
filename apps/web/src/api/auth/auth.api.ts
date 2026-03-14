'use client';

import { apiClient, createApiError } from '@/api/client';
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
} from './auth.model';

const AUTH_BASE_PATH = '/auth';

export const AuthApi = {
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${AUTH_BASE_PATH}/login`,
        input,
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not log in.');
    }
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${AUTH_BASE_PATH}/register`,
        input,
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not create account.');
    }
  },

  async me(): Promise<AuthUser> {
    try {
      const response = await apiClient.get<AuthUser>(`${AUTH_BASE_PATH}/me`);

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not load the current user.');
    }
  },
};
