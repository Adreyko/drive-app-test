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
import type { DriveWorkspaceState } from '@/shared/features/drive/hooks/use-drive-workspace-state';

type UseFolderWorkspaceActionsOptions = Readonly<{
  currentFolder: FolderItem | null;
  state: Pick<DriveWorkspaceState, 'feedback' | 'location' | 'modals'>;
}>;

export function useFolderWorkspaceActions({
  currentFolder,
  state,
}: UseFolderWorkspaceActionsOptions) {
  const queryClient = useQueryClient();
  const createFolderMutation = useCreateFolderMutation();
  const renameFolderMutation = useRenameFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();

  async function createFolder(name: string): Promise<boolean> {
    state.feedback.resetFeedback();

    try {
      await createFolderMutation.mutateAsync({
        name: name.trim(),
        parentId: state.location.currentFolderId,
      });
      return true;
    } catch (error) {
      state.feedback.showError(
        getApiErrorMessage(error, 'Could not create folder.'),
      );
      return false;
    }
  }

  async function renameFolder(
    folder: FolderItem,
    nextName: string,
  ): Promise<boolean> {
    state.feedback.resetFeedback();

    try {
      await renameFolderMutation.mutateAsync({
        id: folder.id,
        name: nextName.trim(),
      });

      return true;
    } catch (error) {
      state.feedback.showError(
        getApiErrorMessage(error, 'Could not rename folder.'),
      );

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
    state.feedback.resetFeedback();

    try {
      await deleteFolderMutation.mutateAsync(folder.id);
      await queryClient.invalidateQueries({
        queryKey: filesQueryKeys.all,
      });

      if (state.location.currentFolderId === folder.id) {
        state.location.setCurrentFolderId(folder.parentId);
      }
    } catch (error) {
      state.feedback.showError(
        getApiErrorMessage(error, 'Could not delete folder.'),
      );
    }
  }

  async function deleteCurrentFolder(): Promise<void> {
    if (!currentFolder) {
      return;
    }

    await deleteFolder(currentFolder);
    state.modals.closeCurrentFolderDeleteModal();
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
