import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { StatePanel } from '@/components/ui/state-panel';
import type { FolderSelectOption } from '@/shared/features/folders/utils/folder-tree';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import { FileCard } from './file-card';

type FileListProps = Readonly<{
  currentFolderName: string | null;
  files: FileItem[];
  folderOptions: FolderSelectOption[];
  onDelete: (file: FileItem) => Promise<void>;
  onOpen: (file: FileItem) => Promise<void>;
  onShare: (file: FileItem) => void;
  onUpdate: (file: FileItem, input: UpdateFileInput) => Promise<boolean>;
}>;

export function FileList({
  currentFolderName,
  files,
  folderOptions,
  onDelete,
  onOpen,
  onShare,
  onUpdate,
}: FileListProps) {
  const locationLabel = truncateLongWords(currentFolderName ?? 'Root');

  return (
    <article className="neo-card bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-ink">
            Files
          </p>
          <h2
            className="mt-1 font-display text-xl leading-tight text-ink md:text-2xl"
            title={`${currentFolderName ?? 'Root'} Files`}
          >
            {locationLabel} Files
          </h2>
        </div>
        <div className="neo-badge bg-lemon">{files.length} files</div>
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
              onShare={onShare}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
      {files.length === 0 ? (
        <StatePanel
          badge="Upload"
          className="mt-4"
          description="Add the first file to this location."
          eyebrow="Empty state"
          title="No files in this location"
          tone="sky"
        />
      ) : null}
    </article>
  );
}
