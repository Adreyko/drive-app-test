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
import type { DriveWorkspaceState } from '@/shared/features/drive/hooks/use-drive-workspace-state';

type ShareFileInput = {
  email: string;
  role: ShareRole;
};

type UseFileWorkspaceActionsOptions = Readonly<{
  state: Pick<
    DriveWorkspaceState,
    'feedback' | 'location' | 'modals' | 'upload'
  >;
}>;

export function useFileWorkspaceActions({
  state,
}: UseFileWorkspaceActionsOptions) {
  const uploadFileMutation = useUploadFileMutation();
  const updateFileMutation = useUpdateFileMutation();
  const deleteFileMutation = useDeleteFileMutation();
  const downloadFileUrlMutation = useDownloadFileUrlMutation();
  const shareFileMutation = useShareFileMutation();

  async function uploadFile(): Promise<boolean> {
    if (!state.upload.selectedFile) {
      state.feedback.showError('Select a file before uploading.');
      return false;
    }

    state.feedback.resetFeedback();

    try {
      const uploadedFileName = state.upload.selectedFile.name;
      await uploadFileMutation.mutateAsync({
        file: state.upload.selectedFile,
        folderId: state.location.currentFolderId,
        visibility: state.upload.isUploadPublicView ? 'public' : 'private',
      });
      state.upload.setSelectedFile(null);
      state.upload.setIsUploadPublicView(false);
      state.feedback.showNotice(`Uploaded "${uploadedFileName}".`);
      return true;
    } catch (error) {
      state.feedback.showError(
        getApiErrorMessage(error, 'Could not upload file.'),
      );
      return false;
    }
  }

  async function updateFile(
    file: FileItem,
    input: UpdateFileInput,
  ): Promise<boolean> {
    state.feedback.resetFeedback();

    try {
      await updateFileMutation.mutateAsync({
        id: file.id,
        name: input.name,
        folderId: input.folderId,
        visibility: input.visibility,
      });

      return true;
    } catch (error) {
      state.feedback.showError(
        getApiErrorMessage(error, 'Could not update file.'),
      );

      return false;
    }
  }

  async function deleteFile(file: FileItem): Promise<void> {
    state.feedback.resetFeedback();

    try {
      await deleteFileMutation.mutateAsync(file.id);

      if (state.modals.previewFile?.id === file.id) {
        state.modals.closePreview();
      }
    } catch (error) {
      state.feedback.showError(
        getApiErrorMessage(error, 'Could not delete file.'),
      );
    }
  }

  async function openFile(file: FileItem): Promise<void> {
    state.feedback.resetFeedback();

    try {
      const download = await downloadFileUrlMutation.mutateAsync(file.id);
      state.modals.openPreview(file, download.downloadUrl);
    } catch (error) {
      state.feedback.showError(getApiErrorMessage(error, 'Could not open file.'));
    }
  }

  async function submitShareFile(input: ShareFileInput): Promise<void> {
    if (!state.modals.shareFile) {
      return;
    }

    state.feedback.resetFeedback();

    await shareFileMutation.mutateAsync({
      email: input.email,
      fileId: state.modals.shareFile.id,
      role: input.role,
    });

    state.feedback.showNotice(
      `Shared "${state.modals.shareFile.name}" with ${input.email} as ${input.role}.`,
    );
    state.modals.closeShareModal();
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
