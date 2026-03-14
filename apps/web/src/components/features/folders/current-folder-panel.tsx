'use client';

import { useEffect, useState } from 'react';
import {
  currentFolderPanelCopy,
  folderBrowserCopy,
} from '@/shared/features/folders/constants/folder-ui-copy';
import type { FolderPathItem } from '@/shared/features/folders/utils/folder-tree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderBreadcrumbs } from './folder-breadcrumbs';

type CurrentFolderPanelProps = Readonly<{
  currentFolder: { id: string; name: string } | null;
  errorMessage: string | null;
  noticeMessage: string | null;
  isPending: boolean;
  onRequestDeleteCurrentFolder: () => void;
  onRenameCurrentFolder: (nextName: string) => Promise<void>;
  onSelectFolder: (folderId: string | null) => void;
  pathItems: FolderPathItem[];
}>;

export function CurrentFolderPanel({
  currentFolder,
  errorMessage,
  noticeMessage,
  isPending,
  onRequestDeleteCurrentFolder,
  onRenameCurrentFolder,
  onSelectFolder,
  pathItems,
}: CurrentFolderPanelProps) {
  const [draftName, setDraftName] = useState(currentFolder?.name ?? '');

  useEffect(() => {
    setDraftName(currentFolder?.name ?? '');
  }, [currentFolder?.id, currentFolder?.name]);

  return (
    <section className="neo-card bg-sky p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              {currentFolderPanelCopy.currentLocationEyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
              {currentFolder?.name ?? folderBrowserCopy.rootWorkspaceTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-bold text-ink/80">
              {currentFolder
                ? folderBrowserCopy.nestedLocationDescription
                : folderBrowserCopy.rootLocationDescription}
            </p>
          </div>

          <div className="neo-badge bg-white">
            {currentFolder
              ? folderBrowserCopy.nestedLevelBadge
              : folderBrowserCopy.rootLevelBadge}
          </div>
        </div>

        <FolderBreadcrumbs items={pathItems} onSelect={onSelectFolder} />

        {currentFolder ? (
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <Input
              disabled={isPending}
              onChange={(event) => setDraftName(event.target.value)}
              value={draftName}
            />
            <Button
              disabled={isPending || draftName.trim().length === 0}
              onClick={() => void onRenameCurrentFolder(draftName)}
              variant="primary"
            >
              {folderBrowserCopy.renameCurrentButtonLabel}
            </Button>
            <Button
              disabled={isPending}
              onClick={onRequestDeleteCurrentFolder}
              variant="ink"
            >
              {folderBrowserCopy.deleteCurrentButtonLabel}
            </Button>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="neo-card bg-blush p-4 text-sm font-bold text-ink">
            {errorMessage}
          </div>
        ) : null}

        {noticeMessage ? (
          <div className="neo-card bg-mint p-4 text-sm font-bold text-ink">
            {noticeMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}
