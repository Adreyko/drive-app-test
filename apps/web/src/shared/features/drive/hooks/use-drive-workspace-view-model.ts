'use client';

import { useEffect, useMemo } from 'react';
import type { FileItem } from '@/api/files/files.model';
import type { FolderItem } from '@/api/folders/folders.model';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import type { DriveWorkspaceLocationState } from './use-drive-workspace-state';
import { buildDriveBrowserView } from '../utils/build-drive-browser-view';

type UseDriveWorkspaceViewModelOptions = Readonly<{
  files: FileItem[];
  folders: FolderItem[];
  location: DriveWorkspaceLocationState;
}>;

export function useDriveWorkspaceViewModel({
  files,
  folders,
  location,
}: UseDriveWorkspaceViewModelOptions) {
  const { currentFolderId, setCurrentFolderId } = location;
  const view = useMemo(
    () => buildDriveBrowserView(folders, files, currentFolderId),
    [currentFolderId, files, folders],
  );

  useEffect(() => {
    if (currentFolderId && !view.currentFolder) {
      setCurrentFolderId(null);
    }
  }, [currentFolderId, setCurrentFolderId, view.currentFolder]);

  return {
    ...view,
    visibleFolderLabel: truncateLongWords(view.currentFolder?.name ?? 'Root'),
  };
}

export type DriveWorkspaceViewModel = ReturnType<
  typeof useDriveWorkspaceViewModel
>;
