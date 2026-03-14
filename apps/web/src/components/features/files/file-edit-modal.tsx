'use client';

import { useEffect, useState } from 'react';
import type {
  FileItem,
  FileVisibility,
  UpdateFileInput,
} from '@/api/files/files.model';
import type { FolderSelectOption } from '@/shared/features/folders/utils/folder-tree';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalShell } from '@/components/ui/modal-shell';

type FileEditModalProps = Readonly<{
  canChangeVisibility: boolean;
  canMove: boolean;
  file: FileItem;
  folderOptions: FolderSelectOption[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: UpdateFileInput) => Promise<void>;
}>;

export function FileEditModal({
  canChangeVisibility,
  canMove,
  file,
  folderOptions,
  isSubmitting,
  onClose,
  onSubmit,
}: FileEditModalProps) {
  const fileLabel = truncateLongWords(file.name);
  const [name, setName] = useState(file.name);
  const [folderId, setFolderId] = useState(file.folderId ?? '');
  const [visibility, setVisibility] = useState<FileVisibility>(file.visibility);

  useEffect(() => {
    setName(file.name);
    setFolderId(file.folderId ?? '');
    setVisibility(file.visibility);
  }, [file.folderId, file.name, file.visibility]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      id: file.id,
      name: name.trim(),
      ...(canMove ? { folderId: folderId || null } : {}),
      ...(canChangeVisibility ? { visibility } : {}),
    });
  }

  return (
    <ModalShell
      description="Update the file name, location, and visibility."
      eyebrow="File"
      isDismissible={!isSubmitting}
      onClose={onClose}
      title={`Edit ${fileLabel}`}
      tone="white"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          autoFocus
          disabled={isSubmitting}
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />

        {canMove ? (
          <select
            className="neo-input"
            disabled={isSubmitting}
            onChange={(event) => setFolderId(event.target.value)}
            value={folderId}
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
              checked={visibility === 'public'}
              className="h-5 w-5 accent-black"
              disabled={isSubmitting}
              onChange={(event) =>
                setVisibility(event.target.checked ? 'public' : 'private')
              }
              type="checkbox"
            />
            <span className="text-sm font-bold text-ink">
              Visible to every signed-in user
            </span>
          </label>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSubmitting || name.trim().length === 0} type="submit" variant="primary">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
