'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filesQueryKeys } from '@/api/files/files.queries';
import { SharingApi } from './sharing.api';
import type { ShareFileInput, ShareFileResponse } from './sharing.model';

export function useShareFileMutation() {
  const queryClient = useQueryClient();

  return useMutation<ShareFileResponse, Error, ShareFileInput>({
    mutationFn: SharingApi.shareFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: filesQueryKeys.all,
      });
    },
  });
}
