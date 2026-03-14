'use client';

import { useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@/api/client';
import { filesQueryKeys } from '@/api/files/files.queries';
import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useRenameFolderMutation,
} from '@/api/folders/folders.queries';
import type { FolderItem } from '@/api/folders/folders.model';

type UseFolderBrowserActionsOptions = Readonly<{
  closeCurrentFolderDeleteModal: () => void;
  currentFolder: FolderItem | null;
  currentFolderId: string | null;
  resetFeedback: () => void;
  setCurrentFolderId: (folderId: string | null) => void;
  showError: (message: string) => void;
}>;

export function useFolderBrowserActions({
  closeCurrentFolderDeleteModal,
  currentFolder,
  currentFolderId,
  resetFeedback,
  setCurrentFolderId,
  showError,
}: UseFolderBrowserActionsOptions) {
  const queryClient = useQueryClient();
  const createFolderMutation = useCreateFolderMutation();
  const renameFolderMutation = useRenameFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();

  async function createFolder(name: string): Promise<boolean> {
    resetFeedback();

    try {
      await createFolderMutation.mutateAsync({
        name: name.trim(),
        parentId: currentFolderId,
      });
      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, 'Could not create folder.'));
      return false;
    }
  }

  async function renameFolder(
    folder: FolderItem,
    nextName: string,
  ): Promise<boolean> {
    resetFeedback();

    try {
      await renameFolderMutation.mutateAsync({
        id: folder.id,
        name: nextName.trim(),
      });

      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, 'Could not rename folder.'));

      return false;
    }
  }

  async function renameCurrentFolder(nextName: string): Promise<boolean> {
    if (!currentFolder) {
      return false;
    }

    return renameFolder(currentFolder, nextName);
  }

  async function deleteFolder(folder: FolderItem): Promise<void> {
    resetFeedback();

    try {
      await deleteFolderMutation.mutateAsync(folder.id);
      await queryClient.invalidateQueries({
        queryKey: filesQueryKeys.all,
      });

      if (currentFolderId === folder.id) {
        setCurrentFolderId(folder.parentId);
      }
    } catch (error) {
      showError(getApiErrorMessage(error, 'Could not delete folder.'));
    }
  }

  async function deleteCurrentFolder(): Promise<void> {
    if (!currentFolder) {
      return;
    }

    await deleteFolder(currentFolder);
    closeCurrentFolderDeleteModal();
  }

  return {
    createFolder,
    createFolderMutation,
    deleteCurrentFolder,
    deleteFolder,
    deleteFolderMutation,
    renameCurrentFolder,
    renameFolder,
    renameFolderMutation,
  };
}
