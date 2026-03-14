'use client';

import { useState } from 'react';
import type { FileItem } from '@/api/files/files.model';

export function useDriveWorkspaceState() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(
    null,
  );
  const [isUploadPublicView, setIsUploadPublicView] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isCurrentFolderDeleteModalOpen, setIsCurrentFolderDeleteModalOpen] =
    useState(false);
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
    setIsCurrentFolderDeleteModalOpen(true);
  }

  function closeCurrentFolderDeleteModal(): void {
    setIsCurrentFolderDeleteModalOpen(false);
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
    setIsUploadModalOpen(true);
  }

  function closeUploadModal(): void {
    setIsUploadModalOpen(false);
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
      isCurrentFolderDeleteModalOpen,
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
      isUploadModalOpen,
      openUploadModal,
      selectedFile,
      setIsUploadPublicView,
      setSelectedFile,
    },
  };
}
