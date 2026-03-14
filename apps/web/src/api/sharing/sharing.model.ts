export type ShareRole = 'editor' | 'viewer';

export type ShareFileInput = {
  email: string;
  fileId: string;
  role: ShareRole;
};

export type ShareFileResponse = {
  fileId: string;
  userId: string;
  email: string;
  role: ShareRole;
  createdAt: string;
};
