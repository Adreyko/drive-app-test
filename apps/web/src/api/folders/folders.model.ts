export type FolderItem = {
  id: string;
  name: string;
  parentId: string | null;
  ownerId: string;
  createdAt: string;
};

export type CreateFolderInput = {
  name: string;
  parentId?: string | null;
};

export type UpdateFolderInput = {
  id: string;
  name: string;
};
