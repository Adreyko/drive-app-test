'use client';

import { useEffect, useState } from 'react';
import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { useDisclosure } from '@/shared/hooks/use-disclosure';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const deleteModal = useDisclosure();
  const editModal = useDisclosure();
  const closeEditModal = editModal.close;
  const closeDeleteModal = deleteModal.close;
  const openEditModal = editModal.open;
  const openDeleteModal = deleteModal.open;
  const canRename = file.accessRole !== 'viewer';
  const canMove = file.isOwned;
  const canDelete = file.isOwned;
  const canChangeVisibility = file.isOwned;

  useEffect(() => {
    if (!canRename) {
      closeEditModal();
    }
  }, [canRename, closeEditModal]);

  async function handleSave(input: UpdateFileInput) {
    setIsSubmitting(true);

    try {
      const updated = await onUpdate(file, input);

      if (updated) {
        closeEditModal();
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
      closeDeleteModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    canChangeVisibility,
    canDelete,
    canMove,
    canRename,
    handleDelete,
    handleOpen,
    handleSave,
    isDeleteModalOpen: deleteModal.isOpen,
    isEditModalOpen: editModal.isOpen,
    isSubmitting,
    closeDeleteModal,
    closeEditModal,
    openDeleteModal,
    openEditModal,
  };
}
