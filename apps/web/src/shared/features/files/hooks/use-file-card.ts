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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const canRename = file.accessRole !== 'viewer';
  const canMove = file.isOwned;
  const canDelete = file.isOwned;
  const canChangeVisibility = file.isOwned;

  useEffect(() => {
    if (!canRename) {
      setIsEditModalOpen(false);
    }
  }, [canRename]);

  async function handleSave(input: UpdateFileInput) {
    setIsSubmitting(true);

    try {
      const updated = await onUpdate(file, input);

      if (updated) {
        setIsEditModalOpen(false);
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

  return {
    canChangeVisibility,
    canDelete,
    canMove,
    canRename,
    handleDelete,
    handleOpen,
    handleSave,
    isDeleteModalOpen,
    isEditModalOpen,
    isSubmitting,
    closeEditModal: () => setIsEditModalOpen(false),
    openDeleteModal: () => setIsDeleteModalOpen(true),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
    openEditModal: () => setIsEditModalOpen(true),
  };
}
