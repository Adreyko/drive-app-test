import type { FileItem } from '@/api/files/files.model';
import type { FolderSelectOption } from '@/shared/features/folders/utils/folder-tree';

export function getFileLocationLabel(
  file: FileItem,
  folderOptions: FolderSelectOption[],
): string {
  if (!file.isOwned) {
    return file.ownerEmail;
  }

  return (
    folderOptions.find((option) => option.id === file.folderId)?.label ??
    'Root workspace'
  );
}

export function getFileAccessLabel(file: FileItem): string {
  if (file.accessRole === 'owner') {
    return 'Owner';
  }

  if (file.accessRole === 'editor') {
    return 'Editor';
  }

  return 'Viewer';
}

export function getFileVisibilityLabel(file: FileItem): string {
  return file.visibility === 'public' ? 'Public View' : 'Private';
}
