import { type ResolvedFileAccessRole } from '../enums/file-access-role.enum';
import { type FileVisibility } from '../enums/file-visibility.enum';

export type FileListItem = {
  id: string;
  name: string;
  s3Key: string;
  size: number;
  mimeType: string;
  folderId: string | null;
  ownerId: string;
  ownerEmail: string;
  accessRole: ResolvedFileAccessRole;
  isOwned: boolean;
  visibility: FileVisibility;
  createdAt: Date;
  updatedAt: Date;
};
