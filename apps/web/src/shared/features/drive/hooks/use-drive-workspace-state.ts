'use client';

import { useState } from 'react';
import type { FileItem } from '@/api/files/files.model';
import { useDisclosure } from '@/shared/hooks/use-disclosure';

export function useDriveWorkspaceState() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(
    null,
  );
  const [isUploadPublicView, setIsUploadPublicView] = useState(false);
  const uploadModal = useDisclosure();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const currentFolderDeleteModal = useDisclosure();
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);

  function resetFeedback(): void {
    setActionError(null);
    setActionNotice(null);
  }

  function showError(message: string): void {
    setActionError(message);
    setActionNotice(null);
  }

  function showNotice(message: string): void {
    setActionNotice(message);
    setActionError(null);
  }

  function openCurrentFolderDeleteModal(): void {
    currentFolderDeleteModal.open();
  }

  function closeCurrentFolderDeleteModal(): void {
    currentFolderDeleteModal.close();
  }

  function openPreview(file: FileItem, url: string): void {
    setPreviewFile(file);
    setPreviewUrl(url);
  }

  function closePreview(): void {
    setPreviewFile(null);
    setPreviewUrl(null);
  }

  function openShareModal(file: FileItem): void {
    setShareFile(file);
  }

  function closeShareModal(): void {
    setShareFile(null);
  }

  function openUploadModal(): void {
    uploadModal.open();
  }

  function closeUploadModal(): void {
    uploadModal.close();
    setSelectedFile(null);
    setIsUploadPublicView(false);
  }

  return {
    feedback: {
      actionError,
      actionNotice,
      resetFeedback,
      showError,
      showNotice,
    },
    location: {
      currentFolderId,
      setCurrentFolderId,
    },
    modals: {
      closeCurrentFolderDeleteModal,
      closePreview,
      closeShareModal,
      isCurrentFolderDeleteModalOpen: currentFolderDeleteModal.isOpen,
      openCurrentFolderDeleteModal,
      openPreview,
      openShareModal,
      previewFile,
      previewUrl,
      shareFile,
    },
    upload: {
      closeUploadModal,
      isUploadPublicView,
      isUploadModalOpen: uploadModal.isOpen,
      openUploadModal,
      selectedFile,
      setIsUploadPublicView,
      setSelectedFile,
    },
  };
}

export type DriveWorkspaceState = ReturnType<typeof useDriveWorkspaceState>;
export type DriveWorkspaceFeedbackState = DriveWorkspaceState['feedback'];
export type DriveWorkspaceLocationState = DriveWorkspaceState['location'];
export type DriveWorkspaceModalState = DriveWorkspaceState['modals'];
export type DriveWorkspaceUploadState = DriveWorkspaceState['upload'];
