'use client';

import { useEffect, useState } from 'react';
import type { FileItem, UpdateFileInput } from '@/api/files/files.model';

type UseFileCardOptions = Readonly<{
  file: FileItem;
  onDelete: (file: FileItem) => Promise<void>;
  onOpen: (file: FileItem) => Promise<void>;
  onUpdate: (file: FileItem, input: UpdateFileInput) => Promise<boolean>;
}>;

export function useFileCard({
  file,
  onDelete,
  onOpen,
  onUpdate,
}: UseFileCardOptions) {
  const [draftName, setDraftName] = useState(file.name);
  const [draftFolderId, setDraftFolderId] = useState(file.folderId ?? '');
  const [draftVisibility, setDraftVisibility] = useState(file.visibility);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const canRename = file.accessRole !== 'viewer';
  const canMove = file.isOwned;
  const canDelete = file.isOwned;
  const canChangeVisibility = file.isOwned;

  useEffect(() => {
    setDraftName(file.name);
    setDraftFolderId(file.folderId ?? '');
    setDraftVisibility(file.visibility);
  }, [file.folderId, file.name, file.visibility]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await onUpdate(file, {
        id: file.id,
        name: draftName.trim(),
        ...(canMove ? { folderId: draftFolderId || null } : {}),
        ...(canChangeVisibility ? { visibility: draftVisibility } : {}),
      });

      if (updated) {
        setIsEditing(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOpen() {
    setIsSubmitting(true);

    try {
      await onOpen(file);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);

    try {
      await onDelete(file);
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetDrafts(): void {
    setDraftName(file.name);
    setDraftFolderId(file.folderId ?? '');
    setDraftVisibility(file.visibility);
  }

  function cancelEditing(): void {
    resetDrafts();
    setIsEditing(false);
  }

  return {
    canChangeVisibility,
    canDelete,
    canMove,
    canRename,
    cancelEditing,
    draftFolderId,
    draftName,
    draftVisibility,
    handleDelete,
    handleOpen,
    handleSave,
    isDeleteModalOpen,
    isEditing,
    isSubmitting,
    openDeleteModal: () => setIsDeleteModalOpen(true),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    setDraftFolderId,
    setDraftName,
    setDraftVisibility,
    toggleEditing: () => setIsEditing((current) => !current),
  };
}
