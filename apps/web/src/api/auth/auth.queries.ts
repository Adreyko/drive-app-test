'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthApi } from './auth.api';
import type {
  AuthResponse,
  AuthUser,
  LoginInput,
  RegisterInput,
} from './auth.model';

export const authQueryKeys = {
  all: ['auth'] as const,
  me: () => [...authQueryKeys.all, 'me'] as const,
};

export function useLoginMutation() {
  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: AuthApi.login,
  });
}

export function useRegisterMutation() {
  return useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: AuthApi.register,
  });
}

export function useMeQuery(enabled = true) {
  return useQuery<AuthUser, Error>({
    queryKey: authQueryKeys.me(),
    queryFn: AuthApi.me,
    enabled,
    retry: false,
  });
}
