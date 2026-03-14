'use client';

import { useEffect } from 'react';
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import { useFilesQuery } from '@/api/files/files.queries';
import { useFoldersQuery } from '@/api/folders/folders.queries';
import { FileList } from '@/components/features/files/file-list';
import { FilePreviewModal } from '@/components/features/files/file-preview-modal';
import { SharedFilesPanel } from '@/components/features/files/shared-files-panel';
import { FileUploadPanel } from '@/components/features/files/file-upload-panel';
import { ShareFileModal } from '@/components/features/sharing/share-file-modal';
import { folderBrowserCopy } from '@/shared/features/folders/constants/folder-ui-copy';
import { useDriveWorkspaceState } from '@/shared/features/drive/hooks/use-drive-workspace-state';
import { useFileBrowserActions } from '@/shared/features/drive/hooks/use-file-browser-actions';
import { useFolderBrowserActions } from '@/shared/features/drive/hooks/use-folder-browser-actions';
import { buildDriveBrowserView } from '@/shared/features/drive/utils/build-drive-browser-view';
import { useUnauthorizedRedirect } from '@/shared/hooks/use-unauthorized-redirect';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Input } from '@/components/ui/input';
import { CurrentFolderPanel } from './current-folder-panel';
import { FolderCard } from './folder-card';

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

  useUnauthorizedRedirect(authError);

  useEffect(() => {
    if (state.location.currentFolderId && !view.currentFolder) {
      state.location.setCurrentFolderId(null);
    }
  }, [state.location, view.currentFolder]);

  const folderActions = useFolderBrowserActions({
    closeCurrentFolderDeleteModal: state.modals.closeCurrentFolderDeleteModal,
    currentFolder: view.currentFolder,
    currentFolderId: state.location.currentFolderId,
    newFolderName: state.folderCreation.newFolderName,
    resetFeedback: state.feedback.resetFeedback,
    setCurrentFolderId: state.location.setCurrentFolderId,
    setNewFolderName: state.folderCreation.setNewFolderName,
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
      <section className="neo-card bg-white p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
          {folderBrowserCopy.folderLoadingEyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink">
          {folderBrowserCopy.folderLoadingTitle}
        </h2>
        <p className="mt-4 text-sm font-bold text-ink">
          {folderBrowserCopy.folderLoadingDescription}
        </p>
      </section>
    );
  }

  if (foldersQuery.error && !isUnauthorizedError(foldersQuery.error)) {
    return (
      <section className="neo-card bg-white p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
          {folderBrowserCopy.folderErrorEyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink">
          {folderBrowserCopy.folderErrorTitle}
        </h2>
        <p className="mt-4 text-sm font-bold text-ink">
          {getApiErrorMessage(
            foldersQuery.error,
            folderBrowserCopy.folderErrorFallback,
          )}
        </p>
        <div className="mt-6">
          <Button onClick={() => void foldersQuery.refetch()} variant="secondary">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (filesQuery.error && !isUnauthorizedError(filesQuery.error)) {
    return (
      <section className="neo-card bg-white p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
          {folderBrowserCopy.fileErrorEyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink">
          {folderBrowserCopy.fileErrorTitle}
        </h2>
        <p className="mt-4 text-sm font-bold text-ink">
          {getApiErrorMessage(filesQuery.error, folderBrowserCopy.fileErrorFallback)}
        </p>
        <div className="mt-6">
          <Button onClick={() => void filesQuery.refetch()} variant="secondary">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <CurrentFolderPanel
        currentFolder={view.currentFolder}
        errorMessage={state.feedback.actionError}
        noticeMessage={state.feedback.actionNotice}
        isPending={isMutating}
        onRequestDeleteCurrentFolder={state.modals.openCurrentFolderDeleteModal}
        onRenameCurrentFolder={folderActions.renameCurrentFolder}
        onSelectFolder={state.location.setCurrentFolderId}
        pathItems={view.pathItems}
      />

      <FileUploadPanel
        currentFolderName={view.currentFolder?.name ?? null}
        errorMessage={state.feedback.actionError}
        isPublicView={state.upload.isUploadPublicView}
        isUploading={fileActions.uploadFileMutation.isPending}
        onChange={state.upload.setSelectedFile}
        onTogglePublicView={state.upload.setIsUploadPublicView}
        onSubmit={fileActions.uploadFile}
        selectedFile={state.upload.selectedFile}
      />

      <article className="neo-card bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              {folderBrowserCopy.createFolderEyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
              {folderBrowserCopy.createFolderTitle}
            </h2>
            <p className="mt-3 max-w-xl text-sm font-bold text-ink/80">
              {folderBrowserCopy.createFolderDescriptionPrefix}{' '}
              <span className="underline">
                {view.currentFolder?.name ?? folderBrowserCopy.rootWorkspaceReference}
              </span>
              .
            </p>
          </div>

          <div className="neo-badge bg-lemon">
            {folders.length} total folders
          </div>
        </div>

        <form
          className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]"
          onSubmit={folderActions.createFolder}
        >
          <Input
            disabled={isMutating}
            onChange={(event) =>
              state.folderCreation.setNewFolderName(event.target.value)
            }
            placeholder={folderBrowserCopy.createFolderPlaceholder}
            required
            value={state.folderCreation.newFolderName}
          />
          <Button
            disabled={
              isMutating || state.folderCreation.newFolderName.trim().length === 0
            }
            type="submit"
            variant="primary"
          >
            {folderActions.createFolderMutation.isPending
              ? folderBrowserCopy.createFolderButtonPending
              : folderBrowserCopy.createFolderButtonIdle}
          </Button>
        </form>
      </article>

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

      <article className="neo-card bg-blush p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              {folderBrowserCopy.visibleFoldersEyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
              {view.currentFolder?.name ?? folderBrowserCopy.rootContentsTitle} Contents
            </h2>
          </div>
          <div className="neo-badge bg-white">
            {view.childFolders.length} shown
          </div>
        </div>

        {view.childFolders.length === 0 ? (
          <div className="mt-6 neo-card bg-white p-8">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              {folderBrowserCopy.emptyEyebrow}
            </p>
            <p className="mt-3 max-w-xl text-base font-bold text-ink">
              {view.currentFolder
                ? folderBrowserCopy.nestedEmptyDescription
                : 'You have no folders yet. Create the first root folder above to start building the tree.'}
            </p>
          </div>
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

      {state.modals.isCurrentFolderDeleteModalOpen && view.currentFolder ? (
        <ConfirmationModal
          confirmLabel="Delete Current Folder"
          description={`Delete "${view.currentFolder.name}" and every nested subfolder inside it.`}
          isLoading={folderActions.deleteFolderMutation.isPending}
          onClose={state.modals.closeCurrentFolderDeleteModal}
          onConfirm={folderActions.deleteCurrentFolder}
          title={folderBrowserCopy.deleteCurrentModalTitle}
        />
      ) : null}
    </section>
  );
}
