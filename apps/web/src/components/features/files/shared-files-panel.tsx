import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { StatePanel } from '@/components/ui/state-panel';
import type { FolderSelectOption } from '@/shared/features/folders/utils/folder-tree';
import { FileCard } from './file-card';

type SharedFilesPanelProps = Readonly<{
  files: FileItem[];
  folderOptions: FolderSelectOption[];
  onDelete: (file: FileItem) => Promise<void>;
  onOpen: (file: FileItem) => Promise<void>;
  onUpdate: (file: FileItem, input: UpdateFileInput) => Promise<boolean>;
}>;

export function SharedFilesPanel({
  files,
  folderOptions,
  onDelete,
  onOpen,
  onUpdate,
}: SharedFilesPanelProps) {
  return (
    <article className="neo-card bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-ink">
            Incoming
          </p>
          <h2 className="mt-1 font-display text-xl leading-tight text-ink md:text-2xl">
            Shared files
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-ink/80">
            Shared files and public files from other users are listed here.
          </p>
        </div>
        <div className="neo-badge bg-mint">{files.length} files</div>
      </div>

      {files.length === 0 ? null : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {files.map((file) => (
            <FileCard
              file={file}
              folderOptions={folderOptions}
              key={file.id}
              onDelete={onDelete}
              onOpen={onOpen}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
      {files.length === 0 ? (
        <StatePanel
          badge="Share"
          className="mt-4"
          description="Files shared with you will appear here."
          eyebrow="Empty state"
          title="No incoming files yet"
          tone="sky"
        />
      ) : null}
    </article>
  );
}
