import type { FileItem } from '@/api/files/files.model';
import type { FolderItem } from '@/api/folders/folders.model';

export type WorkspaceSearchResponse = {
  query: string;
  files: FileItem[];
  folders: FolderItem[];
};
