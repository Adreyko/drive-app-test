'use client';

import { Button } from '@/components/ui/button';
import { StatePanel } from '@/components/ui/state-panel';
import type { DriveWorkspaceFoldersSection } from '@/shared/features/drive/hooks/use-drive-workspace';
import { FolderCard } from './folder-card';

type FoldersSectionProps = Readonly<{
  section: DriveWorkspaceFoldersSection;
}>;

export function FoldersSection({ section }: FoldersSectionProps) {
  return (
    <article className="neo-card bg-blush p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-ink">
            Folders
          </p>
          <h2
            className="mt-1 font-display text-xl leading-tight text-ink md:text-2xl"
            title={`${section.currentFolder?.name ?? 'Root'} Folders`}
          >
            {section.visibleFolderLabel} Folders
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="neo-badge bg-white">
            {section.childFolders.length} shown
          </div>
          <Button
            className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
            disabled={section.isPending}
            onClick={section.onOpenCreateFolderModal}
            variant="secondary"
          >
            New Folder
          </Button>
          <Button
            className="px-3 py-1.5 text-xs font-medium tracking-[0.04em]"
            disabled={section.isPending}
            onClick={section.onOpenUploadModal}
            variant="mint"
          >
            New File
          </Button>
        </div>
      </div>

      {section.childFolders.length === 0 ? (
        <StatePanel
          badge="Folders"
          className="mt-6"
          description={
            section.currentFolder
              ? 'Create the first nested folder here.'
              : 'Create your first folder to get started.'
          }
          eyebrow="Empty state"
          title={
            section.currentFolder ? 'No nested folders yet' : 'No folders at root yet'
          }
        />
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {section.childFolders.map((folder) => (
            <FolderCard
              childCount={section.childFolderCounts.get(folder.id) ?? 0}
              folder={folder}
              key={folder.id}
              onDelete={section.onDeleteFolder}
              onOpen={section.onOpenFolder}
              onRename={section.onRenameFolder}
            />
          ))}
        </div>
      )}
    </article>
  );
}
