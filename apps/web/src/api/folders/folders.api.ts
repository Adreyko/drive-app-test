'use client';

import { apiClient, createApiError } from '@/api/client';
import type {
  CreateFolderInput,
  FolderItem,
  UpdateFolderInput,
} from './folders.model';

const FOLDERS_BASE_PATH = '/folders';

export const FoldersApi = {
  async list(): Promise<FolderItem[]> {
    try {
      const response = await apiClient.get<FolderItem[]>(FOLDERS_BASE_PATH);

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not load folders.');
    }
  },

  async create(input: CreateFolderInput): Promise<FolderItem> {
    try {
      const response = await apiClient.post<FolderItem>(FOLDERS_BASE_PATH, input);

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not create folder.');
    }
  },

  async rename(input: UpdateFolderInput): Promise<FolderItem> {
    try {
      const response = await apiClient.patch<FolderItem>(
        `${FOLDERS_BASE_PATH}/${input.id}`,
        {
          name: input.name,
        },
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not rename folder.');
    }
  },

  async remove(folderId: string): Promise<void> {
    try {
      await apiClient.delete(`${FOLDERS_BASE_PATH}/${folderId}`);
    } catch (error) {
      throw createApiError(error, 'Could not delete folder.');
    }
  },
};
