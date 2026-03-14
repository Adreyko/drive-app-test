'use client';

import { useState } from 'react';
import type { FolderItem } from '@/api/folders/folders.model';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import { ActionMenu } from '@/components/ui/action-menu';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { FolderFormModal } from './folder-form-modal';

type FolderCardProps = Readonly<{
  childCount: number;
  folder: FolderItem;
  onDelete: (folder: FolderItem) => Promise<void>;
  onOpen: (folderId: string) => void;
  onRename: (folder: FolderItem, nextName: string) => Promise<boolean>;
}>;

export function FolderCard({
  childCount,
  folder,
  onDelete,
  onOpen,
  onRename,
}: FolderCardProps) {
  const folderLabel = truncateLongWords(folder.name);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function handleDelete() {
    setIsSubmitting(true);

    try {
      await onDelete(folder);
      setIsDeleteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRename(name: string) {
    setIsSubmitting(true);

    try {
      const renamed = await onRename(folder, name);

      if (renamed) {
        setIsRenameModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="neo-card bg-white p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              Folder
            </p>
            <h3
              className="mt-2 font-display text-xl leading-tight text-ink md:text-2xl"
              title={folder.name}
            >
              {folderLabel}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="neo-badge bg-sky">{childCount} items</div>
            <ActionMenu
              items={[
                {
                  disabled: isSubmitting,
                  label: 'Rename Folder',
                  onSelect: () => setIsRenameModalOpen(true),
                },
                {
                  danger: true,
                  disabled: isSubmitting,
                  label: 'Delete Folder',
                  onSelect: () => setIsDeleteModalOpen(true),
                },
              ]}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="neo-card bg-lemon p-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              Created
            </p>
            <p className="mt-2 text-sm font-medium text-ink">
              {new Date(folder.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="neo-card bg-mint p-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              Location
            </p>
            <p className="mt-2 text-sm font-medium text-ink">
              {folder.parentId ? 'Nested' : 'Root'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSubmitting} onClick={() => onOpen(folder.id)} variant="primary">
            Open
          </Button>
        </div>
      </div>

      {isRenameModalOpen ? (
        <FolderFormModal
          description={`Rename ${folder.name}.`}
          initialName={folder.name}
          isSubmitting={isSubmitting}
          onClose={() => setIsRenameModalOpen(false)}
          onSubmit={handleRename}
          submitLabel="Save Changes"
          title="Rename Folder"
        />
      ) : null}

      {isDeleteModalOpen ? (
        <ConfirmationModal
          confirmLabel="Delete Folder"
          description={`Delete "${folder.name}" and every nested subfolder inside this branch.`}
          isLoading={isSubmitting}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Folder?"
        />
      ) : null}
    </article>
  );
}
