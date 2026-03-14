'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FoldersApi } from './folders.api';
import type {
  CreateFolderInput,
  FolderItem,
  UpdateFolderInput,
} from './folders.model';

export const foldersQueryKeys = {
  all: ['folders'] as const,
  list: () => [...foldersQueryKeys.all, 'list'] as const,
};

export function useFoldersQuery(enabled = true) {
  return useQuery<FolderItem[], Error>({
    queryKey: foldersQueryKeys.list(),
    queryFn: FoldersApi.list,
    enabled,
    retry: false,
  });
}

export function useCreateFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation<FolderItem, Error, CreateFolderInput>({
    mutationFn: FoldersApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: foldersQueryKeys.all,
      });
    },
  });
}

export function useRenameFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation<FolderItem, Error, UpdateFolderInput>({
    mutationFn: FoldersApi.rename,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: foldersQueryKeys.all,
      });
    },
  });
}

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: FoldersApi.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: foldersQueryKeys.all,
      });
    },
  });
}
