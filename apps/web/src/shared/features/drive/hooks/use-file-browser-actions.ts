'use client';

import { getApiErrorMessage } from '@/api/client';
import {
  useDeleteFileMutation,
  useDownloadFileUrlMutation,
  useUpdateFileMutation,
  useUploadFileMutation,
} from '@/api/files/files.queries';
import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { useShareFileMutation } from '@/api/sharing/sharing.queries';
import type { ShareRole } from '@/api/sharing/sharing.model';

type ShareFileInput = {
  email: string;
  role: ShareRole;
};

type UseFileBrowserActionsOptions = Readonly<{
  closePreview: () => void;
  closeShareModal: () => void;
  currentFolderId: string | null;
  isUploadPublicView: boolean;
  openPreview: (file: FileItem, url: string) => void;
  previewFile: FileItem | null;
  resetFeedback: () => void;
  selectedFile: globalThis.File | null;
  setIsUploadPublicView: (value: boolean) => void;
  setSelectedFile: (file: globalThis.File | null) => void;
  shareFile: FileItem | null;
  showError: (message: string) => void;
  showNotice: (message: string) => void;
}>;

export function useFileBrowserActions({
  closePreview,
  closeShareModal,
  currentFolderId,
  isUploadPublicView,
  openPreview,
  previewFile,
  resetFeedback,
  selectedFile,
  setIsUploadPublicView,
  setSelectedFile,
  shareFile,
  showError,
  showNotice,
}: UseFileBrowserActionsOptions) {
  const uploadFileMutation = useUploadFileMutation();
  const updateFileMutation = useUpdateFileMutation();
  const deleteFileMutation = useDeleteFileMutation();
  const downloadFileUrlMutation = useDownloadFileUrlMutation();
  const shareFileMutation = useShareFileMutation();

  async function uploadFile(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!selectedFile) {
      showError('Select a file before uploading.');
      return;
    }

    resetFeedback();

    try {
      await uploadFileMutation.mutateAsync({
        file: selectedFile,
        folderId: currentFolderId,
        visibility: isUploadPublicView ? 'public' : 'private',
      });
      setSelectedFile(null);
      setIsUploadPublicView(false);
    } catch (error) {
      showError(getApiErrorMessage(error, 'Could not upload file.'));
    }
  }

  async function updateFile(
    file: FileItem,
    input: UpdateFileInput,
  ): Promise<boolean> {
    resetFeedback();

    try {
      await updateFileMutation.mutateAsync({
        id: file.id,
        name: input.name,
        folderId: input.folderId,
        visibility: input.visibility,
      });

      return true;
    } catch (error) {
      showError(getApiErrorMessage(error, 'Could not update file.'));

      return false;
    }
  }

  async function deleteFile(file: FileItem): Promise<void> {
    resetFeedback();

    try {
      await deleteFileMutation.mutateAsync(file.id);

      if (previewFile?.id === file.id) {
        closePreview();
      }
    } catch (error) {
      showError(getApiErrorMessage(error, 'Could not delete file.'));
    }
  }

  async function openFile(file: FileItem): Promise<void> {
    resetFeedback();

    try {
      const download = await downloadFileUrlMutation.mutateAsync(file.id);
      openPreview(file, download.downloadUrl);
    } catch (error) {
      showError(getApiErrorMessage(error, 'Could not open file.'));
    }
  }

  async function submitShareFile(input: ShareFileInput): Promise<void> {
    if (!shareFile) {
      return;
    }

    resetFeedback();

    await shareFileMutation.mutateAsync({
      email: input.email,
      fileId: shareFile.id,
      role: input.role,
    });

    showNotice(`Shared "${shareFile.name}" with ${input.email} as ${input.role}.`);
    closeShareModal();
  }

  return {
    deleteFile,
    deleteFileMutation,
    isSharing: shareFileMutation.isPending,
    openFile,
    submitShareFile,
    updateFile,
    updateFileMutation,
    uploadFile,
    uploadFileMutation,
  };
}
