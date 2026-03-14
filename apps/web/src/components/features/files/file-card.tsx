'use client';

import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { useFileCard } from '@/shared/features/files/hooks/use-file-card';
import type { FolderSelectOption } from '@/shared/features/folders/utils/folder-tree';
import { formatBytes } from '@/shared/utils/format-bytes';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import { ActionMenu } from '@/components/ui/action-menu';
import { Button } from '@/components/ui/button';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { FileEditModal } from './file-edit-modal';

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
    closeDeleteModal,
    closeEditModal,
    handleDelete,
    handleOpen,
    handleSave,
    isDeleteModalOpen,
    isEditModalOpen,
    isSubmitting,
    openDeleteModal,
    openEditModal,
  } = useFileCard({
    file,
    onDelete,
    onOpen,
    onUpdate,
  });
  const canShare = file.isOwned && Boolean(onShare);
  const locationLabelRaw = !file.isOwned
    ? file.ownerEmail
    : (folderOptions.find((option) => option.id === file.folderId)?.label ??
      'Root');
  const locationLabel = file.isOwned
    ? truncateLongWords(locationLabelRaw)
    : truncateLongWords(locationLabelRaw, 5);
  const fileNameLabel = truncateLongWords(file.name);
  const accessLabel =
    file.accessRole === 'owner'
      ? 'Owner'
      : file.accessRole === 'editor'
        ? 'Editor'
        : 'Viewer';
  const visibilityLabel =
    file.visibility === 'public' ? 'Public View' : 'Private';
  const actionItems = [
    ...(canRename
      ? [
          {
            disabled: isSubmitting,
            label: canMove ? 'Edit Details' : 'Rename',
            onSelect: openEditModal,
          },
        ]
      : []),
    ...(canShare
      ? [
          {
            disabled: isSubmitting,
            label: 'Share',
            onSelect: () => onShare?.(file),
          },
        ]
      : []),
    ...(canDelete
      ? [
          {
            danger: true,
            disabled: isSubmitting,
            label: 'Delete',
            onSelect: openDeleteModal,
          },
        ]
      : []),
  ];

  return (
    <article className="neo-card bg-sky p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              {file.mimeType}
            </p>
            <h3
              className="mt-2 break-words font-display text-xl leading-tight text-ink md:text-2xl"
              title={file.name}
            >
              {fileNameLabel}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="neo-badge bg-white">{accessLabel}</div>
            {actionItems.length > 0 ? <ActionMenu items={actionItems} /> : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              Size
            </p>
            <p className="mt-2 text-sm font-medium text-ink">
              {formatBytes(file.size)}
            </p>
          </div>
          <div className="neo-card bg-lemon p-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              {file.isOwned ? 'Location' : 'Owner'}
            </p>
            <p
              className="mt-2 text-sm font-medium text-ink"
              title={locationLabelRaw}
            >
              {locationLabel}
            </p>
          </div>
          <div className="neo-card bg-mint p-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              Access
            </p>
            <p className="mt-2 text-sm font-medium text-ink">{accessLabel}</p>
          </div>
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              Visibility
            </p>
            <p className="mt-2 text-sm font-medium text-ink">
              {visibilityLabel}
            </p>
          </div>
          <div className="neo-card bg-white p-3">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
              Updated
            </p>
            <p className="mt-2 text-sm font-medium text-ink">
              {new Date(file.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            disabled={isSubmitting}
            onClick={() => void handleOpen()}
            variant="mint"
          >
            Preview
          </Button>
        </div>
      </div>

      {isEditModalOpen ? (
        <FileEditModal
          canChangeVisibility={canChangeVisibility}
          canMove={canMove}
          file={file}
          folderOptions={folderOptions}
          isSubmitting={isSubmitting}
          onClose={closeEditModal}
          onSubmit={handleSave}
        />
      ) : null}

      {isDeleteModalOpen ? (
        <ConfirmationModal
          confirmLabel="Delete File"
          description={`Delete "${file.name}" and remove it from your workspace.`}
          isLoading={isSubmitting}
          onClose={closeDeleteModal}
          onConfirm={handleDelete}
          title="Delete File?"
        />
      ) : null}
    </article>
  );
}
