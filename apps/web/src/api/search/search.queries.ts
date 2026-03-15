'use client';

import { useQuery } from '@tanstack/react-query';
import { SearchApi } from './search.api';
import type { WorkspaceSearchResponse } from './search.model';

export const searchQueryKeys = {
  all: ['search'] as const,
  workspace: (query: string) => [...searchQueryKeys.all, query] as const,
};

export function useWorkspaceSearchQuery(query: string, enabled = true) {
  const normalizedQuery = query.trim();

  return useQuery<WorkspaceSearchResponse, Error>({
    queryKey: searchQueryKeys.workspace(normalizedQuery),
    queryFn: () => SearchApi.searchWorkspace(normalizedQuery),
    enabled: enabled && normalizedQuery.length >= 2,
    retry: false,
  });
}
