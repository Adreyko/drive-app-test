'use client';

import {
  AUTH_TOKEN_COOKIE_NAME,
  AUTH_TOKEN_MAX_AGE_SECONDS,
} from './constants';

export function setAuthToken(token: string) {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${AUTH_TOKEN_MAX_AGE_SECONDS}; samesite=lax`;
}

export function getAuthToken(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const tokenPart = document.cookie
    .split('; ')
    .find((part) => part.startsWith(`${AUTH_TOKEN_COOKIE_NAME}=`));

  if (!tokenPart) {
    return null;
  }

  return decodeURIComponent(tokenPart.split('=').slice(1).join('='));
}

export function clearAuthToken() {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
}
