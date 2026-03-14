'use client';

import { useEffect, useState } from 'react';
import type { FolderItem } from '@/api/folders/folders.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
  const [draftName, setDraftName] = useState(folder.name);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDraftName(folder.name);
  }, [folder.name]);

  async function handleRenameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const renamed = await onRename(folder, draftName);

      if (renamed) {
        setIsEditing(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete "${folder.name}" and all nested subfolders from this folder tree?`,
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onDelete(folder);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <article className="neo-card bg-white p-5">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
              Folder
            </p>
            <h3 className="mt-2 font-display text-2xl uppercase leading-none text-ink">
              {folder.name}
            </h3>
          </div>
          <div className="neo-badge bg-sky">{childCount} kids</div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="neo-card bg-lemon p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Created
            </p>
            <p className="mt-2 text-sm font-bold text-ink">
              {new Date(folder.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="neo-card bg-mint p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              Parent
            </p>
            <p className="mt-2 text-sm font-bold text-ink">
              {folder.parentId ? 'Nested' : 'Root'}
            </p>
          </div>
        </div>

        {isEditing ? (
          <form className="space-y-3" onSubmit={handleRenameSubmit}>
            <Input
              onChange={(event) => setDraftName(event.target.value)}
              required
              value={draftName}
            />
            <div className="flex flex-wrap gap-3">
              <Button disabled={isSubmitting} type="submit" variant="primary">
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => {
                  setDraftName(folder.name);
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
          <Button disabled={isSubmitting} onClick={() => onOpen(folder.id)} variant="primary">
            Open
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={() => setIsEditing((current) => !current)}
            variant="secondary"
          >
            {isEditing ? 'Hide Rename' : 'Rename'}
          </Button>
          <Button disabled={isSubmitting} onClick={handleDelete} variant="ink">
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
