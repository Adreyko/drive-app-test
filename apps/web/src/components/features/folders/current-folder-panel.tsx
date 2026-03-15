'use client';

import { useState } from 'react';
import type { DriveWorkspaceCurrentFolderPanel } from '@/shared/features/drive/hooks/use-drive-workspace';
import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { ActionMenu } from '@/components/ui/action-menu';
import { Button } from '@/components/ui/button';
import { FolderBreadcrumbs } from './folder-breadcrumbs';
import { FolderFormModal } from './folder-form-modal';

type CurrentFolderPanelProps = Readonly<{
  panel: DriveWorkspaceCurrentFolderPanel;
}>;

export function CurrentFolderPanel({ panel }: CurrentFolderPanelProps) {
  const renameModal = useDisclosure();
  const [isRenameSubmitting, setIsRenameSubmitting] = useState(false);

  async function handleRenameFolder(name: string) {
    setIsRenameSubmitting(true);

    try {
      const renamed = await panel.onRenameCurrentFolder(name);

      if (renamed) {
        renameModal.close();
      }
    } finally {
      setIsRenameSubmitting(false);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-5">
        <div className="neo-card flex flex-col gap-3 bg-white px-3 py-3 md:flex-row md:items-center md:justify-between">
          <FolderBreadcrumbs items={panel.pathItems} onSelect={panel.onSelectFolder} />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
              disabled={panel.isPending}
              onClick={panel.onOpenCreateFolderModal}
              variant="primary"
            >
              New Folder
            </Button>
            <Button
              className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
              disabled={panel.isPending}
              onClick={panel.onOpenUploadModal}
              variant="mint"
            >
              New File
            </Button>
            {panel.currentFolder ? (
              <ActionMenu
                compact
                items={[
                  {
                    disabled: panel.isPending,
                    label: 'Rename Folder',
                    onSelect: renameModal.open,
                  },
                  {
                    danger: true,
                    disabled: panel.isPending,
                    label: 'Delete Folder',
                    onSelect: panel.onRequestDeleteCurrentFolder,
                  },
                ]}
              />
            ) : null}
          </div>
        </div>

        {panel.errorMessage ? (
          <div className="neo-card bg-blush px-4 py-3 text-sm font-medium text-ink">
            {panel.errorMessage}
          </div>
        ) : null}

        {panel.noticeMessage ? (
          <div className="neo-card bg-mint px-4 py-3 text-sm font-medium text-ink">
            {panel.noticeMessage}
          </div>
        ) : null}
      </div>

      {renameModal.isOpen && panel.currentFolder ? (
        <div>
          <FolderFormModal
            description={`Rename ${panel.currentFolder.name}.`}
            initialName={panel.currentFolder.name}
            isSubmitting={isRenameSubmitting}
            onClose={renameModal.close}
            onSubmit={handleRenameFolder}
            submitLabel="Save Changes"
            title="Rename Folder"
          />
        </div>
      ) : null}
    </section>
  );
}
