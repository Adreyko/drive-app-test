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
  onShare?: (file: FileItem) => void;
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
  onShare,
  onUpdate,
}: FileCardProps) {
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
  const canShare = file.isOwned && Boolean(onShare);
  const locationLabel = file.isOwned
    ? folderOptions.find((option) => option.id === file.folderId)?.label ??
      'Root workspace'
    : file.ownerEmail;
  const accessLabel =
    file.accessRole === 'owner'
      ? 'Owner'
      : file.accessRole === 'editor'
        ? 'Editor'
        : 'Viewer';
  const visibilityLabel =
    file.visibility === 'public' ? 'Public View' : 'Private';

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
          <div className="neo-badge bg-white">{accessLabel}</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Size
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{formatBytes(file.size)}</p>
          </div>
          <div className="neo-card bg-lemon p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              {file.isOwned ? 'Location' : 'Owner'}
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{locationLabel}</p>
          </div>
          <div className="neo-card bg-mint p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Access
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{accessLabel}</p>
          </div>
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Visibility
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{visibilityLabel}</p>
          </div>
          <div className="neo-card bg-white p-3">
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
            {canMove ? (
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
            ) : null}
            {canChangeVisibility ? (
              <label className="neo-card flex items-center gap-3 bg-white p-4">
                <input
                  checked={draftVisibility === 'public'}
                  className="h-5 w-5 accent-black"
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setDraftVisibility(event.target.checked ? 'public' : 'private')
                  }
                  type="checkbox"
                />
                <span className="text-sm font-bold text-ink">
                  Public view for every authenticated user
                </span>
              </label>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button disabled={isSubmitting} type="submit" variant="primary">
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => {
                  setDraftName(file.name);
                  setDraftFolderId(file.folderId ?? '');
                  setDraftVisibility(file.visibility);
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
          {canRename ? (
            <Button
              disabled={isSubmitting}
              onClick={() => setIsEditing((current) => !current)}
              variant="secondary"
            >
              {isEditing ? 'Hide Edit' : canMove ? 'Rename Or Move' : 'Rename'}
            </Button>
          ) : null}
          {canShare ? (
            <Button disabled={isSubmitting} onClick={() => onShare?.(file)} variant="primary">
              Share
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              disabled={isSubmitting}
              onClick={() => setIsDeleteModalOpen(true)}
              variant="ink"
            >
              Delete
            </Button>
          ) : null}
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
