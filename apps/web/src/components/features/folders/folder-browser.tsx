'use client';

import { useEffect, useState } from 'react';
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import { useFilesQuery } from '@/api/files/files.queries';
import { useFoldersQuery } from '@/api/folders/folders.queries';
import { FileList } from '@/components/features/files/file-list';
import { FilePreviewModal } from '@/components/features/files/file-preview-modal';
import { FileUploadModal } from '@/components/features/files/file-upload-modal';
import { SharedFilesPanel } from '@/components/features/files/shared-files-panel';
import { ShareFileModal } from '@/components/features/sharing/share-file-modal';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { StatePanel } from '@/components/ui/state-panel';
import { useDriveWorkspaceState } from '@/shared/features/drive/hooks/use-drive-workspace-state';
import { useFileBrowserActions } from '@/shared/features/drive/hooks/use-file-browser-actions';
import { useFolderBrowserActions } from '@/shared/features/drive/hooks/use-folder-browser-actions';
import { buildDriveBrowserView } from '@/shared/features/drive/utils/build-drive-browser-view';
import { useUnauthorizedRedirect } from '@/shared/hooks/use-unauthorized-redirect';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import { CurrentFolderPanel } from './current-folder-panel';
import { FolderCard } from './folder-card';
import { FolderFormModal } from './folder-form-modal';

export function FolderBrowser() {
  const foldersQuery = useFoldersQuery();
  const filesQuery = useFilesQuery();
  const state = useDriveWorkspaceState();
  const folders = foldersQuery.data ?? [];
  const files = filesQuery.data ?? [];
  const authError = foldersQuery.error ?? filesQuery.error;
  const view = buildDriveBrowserView(
    folders,
    files,
    state.location.currentFolderId,
  );
  const currentFolderId = state.location.currentFolderId;
  const setCurrentFolderId = state.location.setCurrentFolderId;
  const visibleFolderLabel = truncateLongWords(view.currentFolder?.name ?? 'Root');
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isCreateFolderSubmitting, setIsCreateFolderSubmitting] = useState(false);

  useUnauthorizedRedirect(authError);

  useEffect(() => {
    if (currentFolderId && !view.currentFolder) {
      setCurrentFolderId(null);
    }
  }, [currentFolderId, setCurrentFolderId, view.currentFolder]);

  const folderActions = useFolderBrowserActions({
    closeCurrentFolderDeleteModal: state.modals.closeCurrentFolderDeleteModal,
    currentFolder: view.currentFolder,
    currentFolderId: state.location.currentFolderId,
    resetFeedback: state.feedback.resetFeedback,
    setCurrentFolderId: state.location.setCurrentFolderId,
    showError: state.feedback.showError,
  });

  const fileActions = useFileBrowserActions({
    closePreview: state.modals.closePreview,
    closeShareModal: state.modals.closeShareModal,
    currentFolderId: state.location.currentFolderId,
    isUploadPublicView: state.upload.isUploadPublicView,
    openPreview: state.modals.openPreview,
    previewFile: state.modals.previewFile,
    resetFeedback: state.feedback.resetFeedback,
    selectedFile: state.upload.selectedFile,
    setIsUploadPublicView: state.upload.setIsUploadPublicView,
    setSelectedFile: state.upload.setSelectedFile,
    shareFile: state.modals.shareFile,
    showError: state.feedback.showError,
    showNotice: state.feedback.showNotice,
  });

  const isMutating =
    folderActions.createFolderMutation.isPending ||
    folderActions.renameFolderMutation.isPending ||
    folderActions.deleteFolderMutation.isPending ||
    fileActions.uploadFileMutation.isPending ||
    fileActions.updateFileMutation.isPending ||
    fileActions.deleteFileMutation.isPending ||
    fileActions.isSharing;

  if (foldersQuery.isLoading) {
    return (
      <StatePanel
        badge="Folders"
        description="Loading your folders."
        eyebrow="Folders"
        title="Loading folders"
      />
    );
  }

  if (foldersQuery.error && !isUnauthorizedError(foldersQuery.error)) {
    return (
      <StatePanel
        action={
          <Button onClick={() => void foldersQuery.refetch()} variant="secondary">
            Retry
          </Button>
        }
        badge="Folders"
        description={getApiErrorMessage(foldersQuery.error, 'Could not load folders.')}
        eyebrow="Folders"
        title="Folder data unavailable"
        tone="blush"
      />
    );
  }

  if (filesQuery.error && !isUnauthorizedError(filesQuery.error)) {
    return (
      <StatePanel
        action={
          <Button onClick={() => void filesQuery.refetch()} variant="secondary">
            Retry
          </Button>
        }
        badge="Files"
        description={getApiErrorMessage(filesQuery.error, 'Could not load files.')}
        eyebrow="Files"
        title="File data unavailable"
        tone="blush"
      />
    );
  }

  async function handleCreateFolder(name: string) {
    setIsCreateFolderSubmitting(true);

    try {
      const created = await folderActions.createFolder(name);

      if (created) {
        setIsCreateFolderModalOpen(false);
      }
    } finally {
      setIsCreateFolderSubmitting(false);
    }
  }

  return (
    <section className="space-y-6">
      <CurrentFolderPanel
        currentFolder={view.currentFolder}
        errorMessage={state.feedback.actionError}
        noticeMessage={state.feedback.actionNotice}
        isPending={isMutating}
        onOpenCreateFolderModal={() => setIsCreateFolderModalOpen(true)}
        onOpenUploadModal={state.upload.openUploadModal}
        onRequestDeleteCurrentFolder={state.modals.openCurrentFolderDeleteModal}
        onRenameCurrentFolder={folderActions.renameCurrentFolder}
        onSelectFolder={state.location.setCurrentFolderId}
        pathItems={view.pathItems}
      />

      <article className="neo-card bg-blush p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.08em] text-ink">
              Folders
            </p>
            <h2
              className="mt-1 font-display text-xl leading-tight text-ink md:text-2xl"
              title={`${view.currentFolder?.name ?? 'Root'} Folders`}
            >
              {visibleFolderLabel} Folders
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="neo-badge bg-white">
              {view.childFolders.length} shown
            </div>
            <Button
              className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
              disabled={isMutating}
              onClick={() => setIsCreateFolderModalOpen(true)}
              variant="secondary"
            >
              New Folder
            </Button>
            <Button
              className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
              disabled={isMutating}
              onClick={state.upload.openUploadModal}
              variant="mint"
            >
              New File
            </Button>
          </div>
        </div>

        {view.childFolders.length === 0 ? (
          <StatePanel
            badge="Folders"
            className="mt-6"
            description={
              view.currentFolder
                ? 'Create the first nested folder here.'
                : 'Create your first folder to get started.'
            }
            eyebrow="Empty state"
            title={
              view.currentFolder
                ? 'No nested folders yet'
                : 'No folders at root yet'
            }
          />
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {view.childFolders.map((folder) => (
              <FolderCard
                childCount={view.childFolderCounts.get(folder.id) ?? 0}
                folder={folder}
                key={folder.id}
                onDelete={folderActions.deleteFolder}
                onOpen={state.location.setCurrentFolderId}
                onRename={folderActions.renameFolder}
              />
            ))}
          </div>
        )}
      </article>

      {isCreateFolderModalOpen ? (
        <FolderFormModal
          description={`Create a folder in ${view.currentFolder?.name ?? 'Root'}.`}
          isSubmitting={isCreateFolderSubmitting}
          onClose={() => setIsCreateFolderModalOpen(false)}
          onSubmit={handleCreateFolder}
          submitLabel="Create Folder"
          title="New Folder"
        />
      ) : null}

      <FileList
        currentFolderName={view.currentFolder?.name ?? null}
        files={view.visibleFiles}
        folderOptions={view.folderOptions}
        onDelete={fileActions.deleteFile}
        onOpen={fileActions.openFile}
        onShare={state.modals.openShareModal}
        onUpdate={fileActions.updateFile}
      />

      <SharedFilesPanel
        files={view.sharedFiles}
        folderOptions={view.folderOptions}
        onDelete={fileActions.deleteFile}
        onOpen={fileActions.openFile}
        onUpdate={fileActions.updateFile}
      />

      {state.modals.previewFile && state.modals.previewUrl ? (
        <FilePreviewModal
          file={state.modals.previewFile}
          onClose={state.modals.closePreview}
          previewUrl={state.modals.previewUrl}
        />
      ) : null}

      {state.modals.shareFile ? (
        <ShareFileModal
          file={state.modals.shareFile}
          isSubmitting={fileActions.isSharing}
          onClose={state.modals.closeShareModal}
          onSubmit={fileActions.submitShareFile}
        />
      ) : null}

      {state.upload.isUploadModalOpen ? (
        <FileUploadModal
          currentFolderName={view.currentFolder?.name ?? null}
          errorMessage={state.feedback.actionError}
          isPublicView={state.upload.isUploadPublicView}
          isUploading={fileActions.uploadFileMutation.isPending}
          onChange={state.upload.setSelectedFile}
          onClose={state.upload.closeUploadModal}
          onSubmit={fileActions.uploadFile}
          onTogglePublicView={state.upload.setIsUploadPublicView}
          selectedFile={state.upload.selectedFile}
        />
      ) : null}

      {state.modals.isCurrentFolderDeleteModalOpen && view.currentFolder ? (
        <ConfirmationModal
          confirmLabel="Delete Current Folder"
          description={`Delete "${view.currentFolder.name}" and every nested subfolder inside it.`}
          isLoading={folderActions.deleteFolderMutation.isPending}
          onClose={state.modals.closeCurrentFolderDeleteModal}
          onConfirm={folderActions.deleteCurrentFolder}
          title="Delete Folder?"
        />
      ) : null}
    </section>
  );
}
