'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FilesApi } from './files.api';
import type {
  FileItem,
  UploadFileInput,
} from './files.model';

export const filesQueryKeys = {
  all: ['files'] as const,
  list: () => [...filesQueryKeys.all, 'list'] as const,
};

export function useFilesQuery(enabled = true) {
  return useQuery<FileItem[], Error>({
    queryKey: filesQueryKeys.list(),
    queryFn: FilesApi.list,
    enabled,
    retry: false,
  });
}

export function useUploadFileMutation() {
  const queryClient = useQueryClient();

  return useMutation<FileItem, Error, UploadFileInput>({
    mutationFn: async ({ file, folderId }) => {
      const mimeType = file.type || 'application/octet-stream';
      const upload = await FilesApi.requestUploadUrl({
        name: file.name,
        mimeType,
        size: file.size,
        folderId,
      });

      await FilesApi.uploadToStorage(upload, file);

      return FilesApi.createMetadata({
        name: file.name,
        s3Key: upload.s3Key,
        size: file.size,
        mimeType,
        folderId,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: filesQueryKeys.all,
      });
    },
  });
}
