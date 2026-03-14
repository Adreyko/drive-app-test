import { FileAccessRole } from '../enums/file-access-role.enum';

export type ShareFileResponse = {
  fileId: string;
  userId: string;
  email: string;
  role: FileAccessRole;
  createdAt: Date;
};
