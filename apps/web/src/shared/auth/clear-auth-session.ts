'use client';

import type { QueryClient } from '@tanstack/react-query';
import { authQueryKeys } from '@/api/auth/auth.queries';
import { filesQueryKeys } from '@/api/files/files.queries';
import { foldersQueryKeys } from '@/api/folders/folders.queries';
import { clearAuthToken } from '@/lib/auth/token-storage';

export function clearAuthSession(queryClient: QueryClient): void {
  clearAuthToken();
  queryClient.removeQueries({ queryKey: authQueryKeys.all });
  queryClient.removeQueries({ queryKey: foldersQueryKeys.all });
  queryClient.removeQueries({ queryKey: filesQueryKeys.all });
}
