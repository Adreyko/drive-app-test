'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isUnauthorizedError } from '@/api/client';
import { clearAuthSession } from '@/shared/auth/clear-auth-session';

export function useUnauthorizedRedirect(error: unknown): void {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!error || !isUnauthorizedError(error)) {
      return;
    }

    clearAuthSession(queryClient);
    router.replace('/login');
  }, [error, queryClient, router]);
}
