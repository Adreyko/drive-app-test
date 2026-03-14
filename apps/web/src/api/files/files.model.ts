export type FileItem = {
  id: string;
  name: string;
  s3Key: string;
  size: number;
  mimeType: string;
  folderId: string | null;
  ownerId: string;
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
  folderId?: string | null;
};

export type UploadFileInput = {
  file: globalThis.File;
  folderId?: string | null;
};
