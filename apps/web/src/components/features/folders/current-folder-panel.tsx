'use client';

import { useState } from 'react';
import type { FolderPathItem } from '@/shared/features/folders/utils/folder-tree';
import { ActionMenu } from '@/components/ui/action-menu';
import { Button } from '@/components/ui/button';
import { FolderBreadcrumbs } from './folder-breadcrumbs';
import { FolderFormModal } from './folder-form-modal';

type CurrentFolderPanelProps = Readonly<{
  currentFolder: { id: string; name: string } | null;
  errorMessage: string | null;
  noticeMessage: string | null;
  isPending: boolean;
  onOpenCreateFolderModal: () => void;
  onOpenUploadModal: () => void;
  onRequestDeleteCurrentFolder: () => void;
  onRenameCurrentFolder: (nextName: string) => Promise<boolean>;
  onSelectFolder: (folderId: string | null) => void;
  pathItems: FolderPathItem[];
}>;

export function CurrentFolderPanel({
  currentFolder,
  errorMessage,
  noticeMessage,
  isPending,
  onOpenCreateFolderModal,
  onOpenUploadModal,
  onRequestDeleteCurrentFolder,
  onRenameCurrentFolder,
  onSelectFolder,
  pathItems,
}: CurrentFolderPanelProps) {
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isRenameSubmitting, setIsRenameSubmitting] = useState(false);

  async function handleRenameFolder(name: string) {
    setIsRenameSubmitting(true);

    try {
      const renamed = await onRenameCurrentFolder(name);

      if (renamed) {
        setIsRenameModalOpen(false);
      }
    } finally {
      setIsRenameSubmitting(false);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-5">
        <div className="neo-card flex flex-col gap-3 bg-white px-3 py-3 md:flex-row md:items-center md:justify-between">
          <FolderBreadcrumbs items={pathItems} onSelect={onSelectFolder} />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
              disabled={isPending}
              onClick={onOpenCreateFolderModal}
              variant="primary"
            >
              New Folder
            </Button>
            <Button
              className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
              disabled={isPending}
              onClick={onOpenUploadModal}
              variant="mint"
            >
              New File
            </Button>
            {currentFolder ? (
              <ActionMenu
                compact
                items={[
                  {
                    disabled: isPending,
                    label: 'Rename Folder',
                    onSelect: () => setIsRenameModalOpen(true),
                  },
                  {
                    danger: true,
                    disabled: isPending,
                    label: 'Delete Folder',
                    onSelect: onRequestDeleteCurrentFolder,
                  },
                ]}
              />
            ) : null}
          </div>
        </div>

        {errorMessage ? (
          <div className="neo-card bg-blush px-4 py-3 text-sm font-medium text-ink">
            {errorMessage}
          </div>
        ) : null}

        {noticeMessage ? (
          <div className="neo-card bg-mint px-4 py-3 text-sm font-medium text-ink">
            {noticeMessage}
          </div>
        ) : null}
      </div>

      {isRenameModalOpen && currentFolder ? (
        <div>
          <FolderFormModal
          description={`Rename ${currentFolder.name}.`}
          initialName={currentFolder.name}
          isSubmitting={isRenameSubmitting}
          onClose={() => setIsRenameModalOpen(false)}
          onSubmit={handleRenameFolder}
          submitLabel="Save Changes"
          title="Rename Folder"
          />
        </div>
      ) : null}
    </section>
  );
}
