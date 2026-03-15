import { Folder } from '../../folders/entities/folder.entity';
import { type FileListItem } from '../../files/interfaces/file-list-item.interface';

export type WorkspaceSearchResponse = {
  query: string;
  files: FileListItem[];
  folders: Folder[];
};
