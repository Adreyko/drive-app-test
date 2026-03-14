import { type FileListItem } from './interfaces/file-list-item.interface';
import { type ResolvedFileAccessRole } from './enums/file-access-role.enum';
import { File } from './entities/file.entity';

export function toFileListItem(
  file: File,
  accessRole: ResolvedFileAccessRole,
): FileListItem {
  return {
    id: file.id,
    name: file.name,
    s3Key: file.s3Key,
    size: file.size,
    mimeType: file.mimeType,
    visibility: file.visibility,
    folderId: file.folderId,
    ownerId: file.ownerId,
    ownerEmail: file.owner.email,
    accessRole,
    isOwned: accessRole === 'owner',
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
  };
}
