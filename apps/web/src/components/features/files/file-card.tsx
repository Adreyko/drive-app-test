'use client';

import { useEffect, useState } from 'react';
import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Input } from '@/components/ui/input';

export type FileFolderOption = {
  id: string | null;
  label: string;
};

type FileCardProps = Readonly<{
  file: FileItem;
  folderOptions: FileFolderOption[];
  onDelete: (file: FileItem) => Promise<void>;
  onOpen: (file: FileItem) => Promise<void>;
  onUpdate: (file: FileItem, input: UpdateFileInput) => Promise<boolean>;
}>;

function formatBytes(value: number): string {
  if (value < 1024) {
    return `${value} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = value / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function FileCard({
  file,
  folderOptions,
  onDelete,
  onOpen,
  onUpdate,
}: FileCardProps) {
  const [draftName, setDraftName] = useState(file.name);
  const [draftFolderId, setDraftFolderId] = useState(file.folderId ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const locationLabel =
    folderOptions.find((option) => option.id === file.folderId)?.label ??
    'Root workspace';

  useEffect(() => {
    setDraftName(file.name);
    setDraftFolderId(file.folderId ?? '');
  }, [file.folderId, file.name]);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await onUpdate(file, {
        id: file.id,
        name: draftName.trim(),
        folderId: draftFolderId || null,
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

  return (
    <article className="neo-card bg-sky p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
              {file.mimeType}
            </p>
            <h3 className="mt-2 break-words font-display text-2xl uppercase leading-none text-ink">
              {file.name}
            </h3>
          </div>
          <div className="neo-badge bg-white">File</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Size
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{formatBytes(file.size)}</p>
          </div>
          <div className="neo-card bg-lemon p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Location
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{locationLabel}</p>
          </div>
          <div className="neo-card bg-mint p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Updated
            </p>
            <p className="mt-2 text-sm font-bold text-ink">
              {new Date(file.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form className="space-y-3" onSubmit={handleSave}>
            <Input
              disabled={isSubmitting}
              onChange={(event) => setDraftName(event.target.value)}
              required
              value={draftName}
            />
            <select
              className="neo-input"
              disabled={isSubmitting}
              onChange={(event) => setDraftFolderId(event.target.value)}
              value={draftFolderId}
            >
              {folderOptions.map((option) => (
                <option key={option.id ?? 'root'} value={option.id ?? ''}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap gap-3">
              <Button disabled={isSubmitting} type="submit" variant="primary">
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => {
                  setDraftName(file.name);
                  setDraftFolderId(file.folderId ?? '');
                  setIsEditing(false);
                }}
                type="button"
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSubmitting} onClick={() => void handleOpen()} variant="mint">
            Preview
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => setIsEditing((current) => !current)}
            variant="secondary"
          >
            {isEditing ? 'Hide Edit' : 'Rename Or Move'}
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => setIsDeleteModalOpen(true)}
            variant="ink"
          >
            Delete
          </Button>
        </div>
      </div>

      {isDeleteModalOpen ? (
        <ConfirmationModal
          confirmLabel="Delete File"
          description={`Delete "${file.name}" from storage and remove its metadata record.`}
          isLoading={isSubmitting}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete File?"
        />
      ) : null}
    </article>
  );
}
