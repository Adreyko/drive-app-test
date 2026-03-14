import type { FolderItem } from '@/api/folders/folders.model';

export type FolderPathItem = {
  id: string | null;
  name: string;
};

export type FolderSelectOption = {
  id: string | null;
  label: string;
};

export function sortFolders(folders: FolderItem[]): FolderItem[] {
  return [...folders].sort((left, right) => left.name.localeCompare(right.name));
}

export function buildBreadcrumbItems(
  folders: FolderItem[],
  currentFolderId: string | null,
): FolderPathItem[] {
  const items: FolderPathItem[] = [{ id: null, name: 'Root' }];

  if (!currentFolderId) {
    return items;
  }

  const foldersMap = new Map(folders.map((folder) => [folder.id, folder]));
  const path: FolderItem[] = [];
  let cursor = foldersMap.get(currentFolderId) ?? null;

  while (cursor) {
    path.unshift(cursor);
    cursor = cursor.parentId ? foldersMap.get(cursor.parentId) ?? null : null;
  }

  for (const folder of path) {
    items.push({ id: folder.id, name: folder.name });
  }

  return items;
}

export function buildFolderOptions(folders: FolderItem[]): FolderSelectOption[] {
  const foldersMap = new Map(folders.map((folder) => [folder.id, folder]));
  const options: FolderSelectOption[] = [
    {
      id: null,
      label: 'Root workspace',
    },
  ];

  const nestedOptions = folders
    .map((folder) => ({
      id: folder.id,
      label: buildFolderPathLabel(foldersMap, folder.id),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));

  return [...options, ...nestedOptions];
}

export function buildFolderChildCountMap(
  folders: FolderItem[],
): Map<string, number> {
  const childCountByFolderId = new Map<string, number>();

  for (const folder of folders) {
    if (!folder.parentId) {
      continue;
    }

    childCountByFolderId.set(
      folder.parentId,
      (childCountByFolderId.get(folder.parentId) ?? 0) + 1,
    );
  }

  return childCountByFolderId;
}

function buildFolderPathLabel(
  foldersMap: Map<string, FolderItem>,
  folderId: string,
): string {
  const path: string[] = [];
  let cursor = foldersMap.get(folderId) ?? null;

  while (cursor) {
    path.unshift(cursor.name);
    cursor = cursor.parentId ? foldersMap.get(cursor.parentId) ?? null : null;
  }

  return ['Root', ...path].join(' / ');
}
