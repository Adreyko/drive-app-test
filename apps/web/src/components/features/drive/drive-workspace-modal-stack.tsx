'use client';

import { FilePreviewModal } from '@/components/features/files/file-preview-modal';
import { FileUploadModal } from '@/components/features/files/file-upload-modal';
import { ShareFileModal } from '@/components/features/sharing/share-file-modal';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import type { DriveWorkspaceModals } from '@/shared/features/drive/hooks/use-drive-workspace';
import { FolderFormModal } from '../folders/folder-form-modal';

type DriveWorkspaceModalStackProps = Readonly<{
  modals: DriveWorkspaceModals;
}>;

export function DriveWorkspaceModalStack({
  modals,
}: DriveWorkspaceModalStackProps) {
  return (
    <>
      {modals.createFolder.isOpen ? (
        <FolderFormModal
          description={modals.createFolder.description}
          isSubmitting={modals.createFolder.isSubmitting}
          onClose={modals.createFolder.close}
          onSubmit={modals.createFolder.submit}
          submitLabel="Create Folder"
          title="New Folder"
        />
      ) : null}

      {modals.previewFile.file && modals.previewFile.previewUrl ? (
        <FilePreviewModal
          file={modals.previewFile.file}
          onClose={modals.previewFile.close}
          previewUrl={modals.previewFile.previewUrl}
        />
      ) : null}

      {modals.shareFile.file ? (
        <ShareFileModal
          file={modals.shareFile.file}
          isSubmitting={modals.shareFile.isSubmitting}
          onClose={modals.shareFile.close}
          onSubmit={modals.shareFile.submit}
        />
      ) : null}

      {modals.uploadFile.isOpen ? (
        <FileUploadModal
          currentFolderName={modals.uploadFile.currentFolderName}
          errorMessage={modals.uploadFile.errorMessage}
          isPublicView={modals.uploadFile.isPublicView}
          isUploading={modals.uploadFile.isUploading}
          onChange={modals.uploadFile.setSelectedFile}
          onClose={modals.uploadFile.close}
          onSubmit={modals.uploadFile.submit}
          onTogglePublicView={modals.uploadFile.setPublicView}
          selectedFile={modals.uploadFile.selectedFile}
        />
      ) : null}

      {modals.deleteCurrentFolder.isOpen && modals.deleteCurrentFolder.currentFolder ? (
        <ConfirmationModal
          confirmLabel="Delete Current Folder"
          description={`Delete "${modals.deleteCurrentFolder.currentFolder.name}" and every nested subfolder inside it.`}
          isLoading={modals.deleteCurrentFolder.isSubmitting}
          onClose={modals.deleteCurrentFolder.close}
          onConfirm={modals.deleteCurrentFolder.submit}
          title="Delete Folder?"
        />
      ) : null}
    </>
  );
}
