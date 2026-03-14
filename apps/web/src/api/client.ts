'use client';

import axios from 'axios';
import { getAuthToken } from '@/lib/auth/token-storage';

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong.',
): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (
      typeof responseData === 'object' &&
      responseData !== null &&
      'message' in responseData
    ) {
      const message = responseData.message;

      if (Array.isArray(message)) {
        return message[0] ?? fallback;
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export function createApiError(
  error: unknown,
  fallback = 'Something went wrong.',
): ApiError {
  if (axios.isAxiosError(error)) {
    return new ApiError(
      getApiErrorMessage(error, fallback),
      error.response?.status,
    );
  }

  if (error instanceof ApiError) {
    return error;
  }

  return new ApiError(getApiErrorMessage(error, fallback));
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.statusCode === 401;
  }

  return axios.isAxiosError(error) && error.response?.status === 401;
}
