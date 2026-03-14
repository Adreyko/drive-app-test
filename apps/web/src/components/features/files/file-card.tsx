'use client';

import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { fileCardCopy } from '@/shared/features/files/constants/file-ui-copy';
import { useFileCard } from '@/shared/features/files/hooks/use-file-card';
import {
  getFileAccessLabel,
  getFileLocationLabel,
  getFileVisibilityLabel,
} from '@/shared/features/files/utils/file-card-meta';
import type { FolderSelectOption } from '@/shared/features/folders/utils/folder-tree';
import { formatBytes } from '@/shared/utils/format-bytes';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Input } from '@/components/ui/input';

type FileCardProps = Readonly<{
  file: FileItem;
  folderOptions: FolderSelectOption[];
  onDelete: (file: FileItem) => Promise<void>;
  onOpen: (file: FileItem) => Promise<void>;
  onShare?: (file: FileItem) => void;
  onUpdate: (file: FileItem, input: UpdateFileInput) => Promise<boolean>;
}>;

export function FileCard({
  file,
  folderOptions,
  onDelete,
  onOpen,
  onShare,
  onUpdate,
}: FileCardProps) {
  const {
    canChangeVisibility,
    canDelete,
    canMove,
    canRename,
    cancelEditing,
    closeDeleteModal,
    draftFolderId,
    draftName,
    draftVisibility,
    handleDelete,
    handleOpen,
    handleSave,
    isDeleteModalOpen,
    isEditing,
    isSubmitting,
    openDeleteModal,
    setDraftFolderId,
    setDraftName,
    setDraftVisibility,
    toggleEditing,
  } = useFileCard({
    file,
    onDelete,
    onOpen,
    onUpdate,
  });
  const canShare = file.isOwned && Boolean(onShare);
  const locationLabel = getFileLocationLabel(file, folderOptions);
  const accessLabel = getFileAccessLabel(file);
  const visibilityLabel = getFileVisibilityLabel(file);

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
              {fileCardCopy.sizeLabel}
            </p>
            <p className="mt-2 text-sm font-bold text-ink">
              {formatBytes(file.size)}
            </p>
          </div>
          <div className="neo-card bg-lemon p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              {file.isOwned ? fileCardCopy.locationLabel : fileCardCopy.ownerLabel}
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{locationLabel}</p>
          </div>
          <div className="neo-card bg-mint p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              {fileCardCopy.accessLabel}
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{accessLabel}</p>
          </div>
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              {fileCardCopy.visibilityLabel}
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{visibilityLabel}</p>
          </div>
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
              {fileCardCopy.updatedLabel}
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
                    setDraftVisibility(
                      event.target.checked ? 'public' : 'private',
                    )
                  }
                  type="checkbox"
                />
                <span className="text-sm font-bold text-ink">
                  {fileCardCopy.publicViewToggleLabel}
                </span>
              </label>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button disabled={isSubmitting} type="submit" variant="primary">
                {isSubmitting
                  ? fileCardCopy.saveButtonPending
                  : fileCardCopy.saveButtonIdle}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={cancelEditing}
                type="button"
                variant="secondary"
              >
                {fileCardCopy.cancelButtonLabel}
              </Button>
            </div>
          </form>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button
            disabled={isSubmitting}
            onClick={() => void handleOpen()}
            variant="mint"
          >
            {fileCardCopy.previewButtonLabel}
          </Button>
          {canRename ? (
            <Button
              disabled={isSubmitting}
              onClick={toggleEditing}
              variant="secondary"
            >
              {isEditing
                ? 'Hide Edit'
                : canMove
                  ? fileCardCopy.renameOrMoveButtonLabel
                  : fileCardCopy.renameButtonLabel}
            </Button>
          ) : null}
          {canShare ? (
            <Button
              disabled={isSubmitting}
              onClick={() => onShare?.(file)}
              variant="primary"
            >
              {fileCardCopy.shareButtonLabel}
            </Button>
          ) : null}
          {canDelete ? (
            <Button
              disabled={isSubmitting}
              onClick={openDeleteModal}
              variant="ink"
            >
              {fileCardCopy.deleteButtonLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {isDeleteModalOpen ? (
        <ConfirmationModal
          confirmLabel={fileCardCopy.deleteConfirmLabel}
          description={`Delete "${file.name}" from storage and remove its metadata record.`}
          isLoading={isSubmitting}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          title={fileCardCopy.deleteTitle}
        />
      ) : null}
    </article>
  );
}
