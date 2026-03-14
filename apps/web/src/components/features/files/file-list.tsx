import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { ownedFilesCopy } from '@/shared/features/files/constants/file-ui-copy';
import type { FolderSelectOption } from '@/shared/features/folders/utils/folder-tree';
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
  return (
    <article className="neo-card bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            {ownedFilesCopy.sectionEyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
            {currentFolderName ?? 'Root'} {ownedFilesCopy.filesSuffix}
          </h2>
        </div>
        <div className="neo-badge bg-lemon">{files.length} files</div>
      </div>

      {files.length === 0 ? (
        <div className="mt-6 neo-card bg-sky p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            {ownedFilesCopy.emptyEyebrow}
          </p>
          <p className="mt-3 text-base font-bold text-ink">
            {ownedFilesCopy.emptyDescription}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
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
    </article>
  );
}
