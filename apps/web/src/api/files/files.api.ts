'use client';

import { apiClient, createApiError } from '@/api/client';
import type {
  CreateFileInput,
  FileItem,
  RequestUploadUrlInput,
  UploadUrlResponse,
} from './files.model';

const FILES_BASE_PATH = '/files';

export const FilesApi = {
  async list(): Promise<FileItem[]> {
    try {
      const response = await apiClient.get<FileItem[]>(FILES_BASE_PATH);

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not load files.');
    }
  },

  async requestUploadUrl(
    input: RequestUploadUrlInput,
  ): Promise<UploadUrlResponse> {
    try {
      const response = await apiClient.post<UploadUrlResponse>(
        `${FILES_BASE_PATH}/upload-url`,
        input,
      );

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not create an upload URL.');
    }
  },

  async uploadToStorage(
    upload: UploadUrlResponse,
    file: globalThis.File,
  ): Promise<void> {
    const response = await fetch(upload.uploadUrl, {
      method: upload.method,
      headers: upload.headers,
      body: file,
    });

    if (!response.ok) {
      throw new Error('Upload to storage failed.');
    }
  },

  async createMetadata(input: CreateFileInput): Promise<FileItem> {
    try {
      const response = await apiClient.post<FileItem>(FILES_BASE_PATH, input);

      return response.data;
    } catch (error) {
      throw createApiError(error, 'Could not save file metadata.');
    }
  },
};
