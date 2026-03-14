'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { authQueryKeys } from '@/api/auth/auth.queries';
import { filesQueryKeys } from '@/api/files/files.queries';
import { foldersQueryKeys } from '@/api/folders/folders.queries';
import { createSocketClient } from '@/api/socket/socket.client';
import { getAuthToken } from '@/lib/auth/token-storage';
import { clearAuthSession } from '@/shared/auth/clear-auth-session';

type RealtimeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

const FILES_UPDATED_EVENT = 'files:updated';

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      return undefined;
    }

    const socket = createSocketClient(token);

    const invalidateWorkspaceData = async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: foldersQueryKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: filesQueryKeys.all,
        }),
      ]);
    };

    const handleConnect = () => {
      void invalidateWorkspaceData();
    };

    const handleFilesUpdated = () => {
      void invalidateWorkspaceData();
    };

    const handleUnauthorized = () => {
      clearAuthSession(queryClient);
      router.replace('/login');
    };

    const handleConnectError = (error: Error) => {
      if (error.message === 'Unauthorized') {
        handleUnauthorized();
      }
    };

    socket.on('connect', handleConnect);
    socket.on(FILES_UPDATED_EVENT, handleFilesUpdated);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off(FILES_UPDATED_EVENT, handleFilesUpdated);
      socket.off('connect_error', handleConnectError);
      disconnectSocket(socket);
    };
  }, [pathname, queryClient, router]);

  return children;
}

function disconnectSocket(socket: Socket): void {
  if (socket.connected) {
    socket.disconnect();
    return;
  }

  socket.close();
}
