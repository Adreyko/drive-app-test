'use client';

import { apiClient, createApiError } from '@/api/client';
import type { ShareFileInput, ShareFileResponse } from './sharing.model';

export const SharingApi = {
  async shareFile(input: ShareFileInput): Promise<ShareFileResponse> {
    try {
      const response = await apiClient.post<ShareFileResponse>(
        `/files/${input.fileId}/share`,
        {
          email: input.email,
          role: input.role,
        },
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not share file.');
    }
  },
};
