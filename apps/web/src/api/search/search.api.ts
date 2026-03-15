'use client';

import { apiClient, createApiError } from '@/api/client';
import type { WorkspaceSearchResponse } from './search.model';

const SEARCH_BASE_PATH = '/search';

export const SearchApi = {
  async searchWorkspace(query: string): Promise<WorkspaceSearchResponse> {
    try {
      const response = await apiClient.get<WorkspaceSearchResponse>(
        SEARCH_BASE_PATH,
        {
          params: {
            q: query,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not search the workspace.');
    }
  },
};
