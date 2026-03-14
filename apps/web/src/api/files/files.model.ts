export type FileAccessRole = 'owner' | 'editor' | 'viewer';
export type FileVisibility = 'private' | 'public';

export type FileItem = {
  id: string;
  name: string;
  s3Key: string;
  size: number;
  mimeType: string;
  visibility: FileVisibility;
  folderId: string | null;
  ownerId: string;
  ownerEmail: string;
  accessRole: FileAccessRole;
  isOwned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RequestUploadUrlInput = {
  name: string;
  mimeType: string;
  size: number;
  folderId?: string | null;
};

export type UploadUrlResponse = {
  uploadUrl: string;
  s3Key: string;
  method: 'PUT';
  headers: {
    'Content-Type': string;
  };
};

export type CreateFileInput = {
  name: string;
  s3Key: string;
  size: number;
  mimeType: string;
  visibility?: FileVisibility;
  folderId?: string | null;
};

export type UpdateFileInput = {
  id: string;
  name?: string;
  folderId?: string | null;
  visibility?: FileVisibility;
};

export type DownloadUrlResponse = {
  downloadUrl: string;
  method: 'GET';
};

export type UploadFileInput = {
  file: globalThis.File;
  folderId?: string | null;
  visibility?: FileVisibility;
};
