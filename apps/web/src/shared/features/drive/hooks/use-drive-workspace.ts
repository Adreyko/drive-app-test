'use client';

import { useUnauthorizedRedirect } from '@/shared/hooks/use-unauthorized-redirect';
import { useDriveWorkspaceActions } from './use-drive-workspace-actions';
import { useDriveWorkspaceData } from './use-drive-workspace-data';
import { useDriveWorkspaceState } from './use-drive-workspace-state';
import { useDriveWorkspaceViewModel } from './use-drive-workspace-view-model';

export function useDriveWorkspace() {
  const state = useDriveWorkspaceState();
  const data = useDriveWorkspaceData();

  useUnauthorizedRedirect(data.authError);

  const viewModel = useDriveWorkspaceViewModel({
    files: data.files,
    folders: data.folders,
    location: state.location,
  });
  const actions = useDriveWorkspaceActions({
    state,
    view: viewModel,
  });

  return {
    currentFolderPanel: {
      currentFolder: viewModel.currentFolder,
      errorMessage: state.feedback.actionError,
      isPending: actions.status.isMutating,
      noticeMessage: state.feedback.actionNotice,
      onOpenCreateFolderModal: actions.folders.createModal.open,
      onOpenUploadModal: actions.files.uploadModal.open,
      onRenameCurrentFolder: actions.folders.current.rename,
      onRequestDeleteCurrentFolder: actions.folders.current.requestDelete,
      onSelectFolder: actions.folders.current.select,
      pathItems: viewModel.pathItems,
    },
    filesSection: {
      currentFolderName: viewModel.currentFolder?.name ?? null,
      files: viewModel.visibleFiles,
      folderOptions: viewModel.folderOptions,
      onDelete: actions.files.list.delete,
      onOpen: actions.files.list.open,
      onShare: actions.files.list.share,
      onUpdate: actions.files.list.update,
    },
    foldersSection: {
      childFolderCounts: viewModel.childFolderCounts,
      childFolders: viewModel.childFolders,
      currentFolder: viewModel.currentFolder,
      isPending: actions.status.isMutating,
      onDeleteFolder: actions.folders.list.delete,
      onOpenCreateFolderModal: actions.folders.createModal.open,
      onOpenFolder: actions.folders.list.open,
      onOpenUploadModal: actions.files.uploadModal.open,
      onRenameFolder: actions.folders.list.rename,
      visibleFolderLabel: viewModel.visibleFolderLabel,
    },
    modals: {
      createFolder: {
        ...actions.folders.createModal,
        description: `Create a folder in ${viewModel.currentFolder?.name ?? 'Root'}.`,
      },
      deleteCurrentFolder: actions.folders.deleteCurrentModal,
      previewFile: actions.files.previewModal,
      shareFile: actions.files.shareModal,
      uploadFile: actions.files.uploadModal,
    },
    sharedFilesSection: {
      files: viewModel.sharedFiles,
      folderOptions: viewModel.folderOptions,
      onDelete: actions.files.list.delete,
      onOpen: actions.files.list.open,
      onUpdate: actions.files.list.update,
    },
    status: {
      fileError: data.filesQuery.error,
      folderError: data.foldersQuery.error,
      isLoading: data.foldersQuery.isLoading,
      refetchFiles: data.filesQuery.refetch,
      refetchFolders: data.foldersQuery.refetch,
    },
  };
}

export type DriveWorkspace = ReturnType<typeof useDriveWorkspace>;
export type DriveWorkspaceCurrentFolderPanel =
  DriveWorkspace['currentFolderPanel'];
export type DriveWorkspaceFilesSection = DriveWorkspace['filesSection'];
export type DriveWorkspaceFoldersSection = DriveWorkspace['foldersSection'];
export type DriveWorkspaceModals = DriveWorkspace['modals'];
export type DriveWorkspaceSharedFilesSection =
  DriveWorkspace['sharedFilesSection'];
