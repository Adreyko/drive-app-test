import type { FileItem } from '@/api/files/files.model';
import type { FolderItem } from '@/api/folders/folders.model';
import {
  buildBreadcrumbItems,
  buildFolderChildCountMap,
  buildFolderOptions,
  sortFolders,
} from '@/shared/features/folders/utils/folder-tree';

export function buildDriveBrowserView(
  folders: FolderItem[],
  files: FileItem[],
  currentFolderId: string | null,
) {
  const ownedFiles = files.filter((file) => file.isOwned);
  const sharedFiles = files.filter((file) => !file.isOwned);
  const currentFolder =
    folders.find((folder) => folder.id === currentFolderId) ?? null;
  const childFolders = sortFolders(
    folders.filter((folder) => folder.parentId === currentFolderId),
  );
  const childFolderCounts = buildFolderChildCountMap(folders);
  const visibleFiles = ownedFiles.filter(
    (file) => file.folderId === currentFolderId,
  );
  const pathItems = buildBreadcrumbItems(folders, currentFolderId);
  const folderOptions = buildFolderOptions(folders);

  return {
    childFolderCounts,
    childFolders,
    currentFolder,
    folderOptions,
    ownedFiles,
    pathItems,
    sharedFiles,
    visibleFiles,
  };
}
