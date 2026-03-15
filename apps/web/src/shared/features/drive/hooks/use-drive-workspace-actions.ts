'use client';

import { useState } from 'react';
import { useFileWorkspaceActions } from '@/shared/features/files/hooks/use-file-workspace-actions';
import { useFolderWorkspaceActions } from '@/shared/features/folders/hooks/use-folder-workspace-actions';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import type { DriveWorkspaceState } from './use-drive-workspace-state';
import type { DriveWorkspaceViewModel } from './use-drive-workspace-view-model';

type UseDriveWorkspaceActionsOptions = Readonly<{
  state: DriveWorkspaceState;
  view: DriveWorkspaceViewModel;
}>;

export function useDriveWorkspaceActions({
  state,
  view,
}: UseDriveWorkspaceActionsOptions) {
  const folderActions = useFolderWorkspaceActions({
    currentFolder: view.currentFolder,
    state,
  });
  const fileActions = useFileWorkspaceActions({ state });
  const createFolderModal = useDisclosure();
  const [isCreateFolderSubmitting, setIsCreateFolderSubmitting] = useState(false);

  async function submitCreateFolder(name: string): Promise<void> {
    setIsCreateFolderSubmitting(true);

    try {
      const created = await folderActions.createFolder(name);

      if (created) {
        createFolderModal.close();
      }
    } finally {
      setIsCreateFolderSubmitting(false);
    }
  }

  const isMutating =
    folderActions.createFolderMutation.isPending ||
    folderActions.renameFolderMutation.isPending ||
    folderActions.deleteFolderMutation.isPending ||
    fileActions.uploadFileMutation.isPending ||
    fileActions.updateFileMutation.isPending ||
    fileActions.deleteFileMutation.isPending ||
    fileActions.isSharing;

  return {
    files: {
      list: {
        delete: fileActions.deleteFile,
        open: fileActions.openFile,
        share: state.modals.openShareModal,
        update: fileActions.updateFile,
      },
      previewModal: {
        close: state.modals.closePreview,
        file: state.modals.previewFile,
        previewUrl: state.modals.previewUrl,
      },
      shareModal: {
        close: state.modals.closeShareModal,
        file: state.modals.shareFile,
        isSubmitting: fileActions.isSharing,
        submit: fileActions.submitShareFile,
      },
      uploadModal: {
        close: state.upload.closeUploadModal,
        currentFolderName: view.currentFolder?.name ?? null,
        errorMessage: state.feedback.actionError,
        isOpen: state.upload.isUploadModalOpen,
        isPublicView: state.upload.isUploadPublicView,
        isUploading: fileActions.uploadFileMutation.isPending,
        open: state.upload.openUploadModal,
        selectedFile: state.upload.selectedFile,
        setPublicView: state.upload.setIsUploadPublicView,
        setSelectedFile: state.upload.setSelectedFile,
        submit: fileActions.uploadFile,
      },
    },
    folders: {
      createModal: {
        close: createFolderModal.close,
        isOpen: createFolderModal.isOpen,
        isSubmitting: isCreateFolderSubmitting,
        open: createFolderModal.open,
        submit: submitCreateFolder,
      },
      current: {
        requestDelete: state.modals.openCurrentFolderDeleteModal,
        rename: folderActions.renameCurrentFolder,
        select: state.location.setCurrentFolderId,
      },
      deleteCurrentModal: {
        close: state.modals.closeCurrentFolderDeleteModal,
        currentFolder: view.currentFolder,
        isOpen: state.modals.isCurrentFolderDeleteModalOpen,
        isSubmitting: folderActions.deleteFolderMutation.isPending,
        submit: folderActions.deleteCurrentFolder,
      },
      list: {
        delete: folderActions.deleteFolder,
        open: state.location.setCurrentFolderId,
        rename: folderActions.renameFolder,
      },
    },
    status: {
      isMutating,
    },
  };
}

export type DriveWorkspaceActions = ReturnType<typeof useDriveWorkspaceActions>;
