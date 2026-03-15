'use client';

import { useFilesQuery } from '@/api/files/files.queries';
import { useFoldersQuery } from '@/api/folders/folders.queries';

export function useDriveWorkspaceData(enabled = true) {
  const foldersQuery = useFoldersQuery(enabled);
  const filesQuery = useFilesQuery(enabled);

  return {
    authError: foldersQuery.error ?? filesQuery.error,
    files: filesQuery.data ?? [],
    filesQuery,
    folders: foldersQuery.data ?? [],
    foldersQuery,
  };
}
