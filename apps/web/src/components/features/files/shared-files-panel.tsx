import type { FileItem, UpdateFileInput } from '@/api/files/files.model';
import { FileCard, type FileFolderOption } from './file-card';

type SharedFilesPanelProps = Readonly<{
  files: FileItem[];
  folderOptions: FileFolderOption[];
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
    <article className="neo-card bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            Shared or public
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
            Incoming Files
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-bold text-ink/80">
            Shared files and public files from other users are listed here outside
            your folder tree. Editors can rename explicit shares, while public
            files stay viewer-only.
          </p>
        </div>
        <div className="neo-badge bg-mint">{files.length} incoming files</div>
      </div>

      {files.length === 0 ? (
        <div className="mt-6 neo-card bg-sky p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            Empty state
          </p>
          <p className="mt-3 text-base font-bold text-ink">
            Files other users share with you, or mark as public, will appear here.
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
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </article>
  );
}
