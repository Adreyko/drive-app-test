import type { FileItem } from '@/api/files/files.model';

type FileListProps = Readonly<{
  currentFolderName: string | null;
  files: FileItem[];
}>;

function formatBytes(value: number): string {
  if (value < 1024) {
    return `${value} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = value / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function FileList({ currentFolderName, files }: FileListProps) {
  return (
    <article className="neo-card bg-white p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            Uploaded files
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
            {currentFolderName ?? 'Root'} Files
          </h2>
        </div>
        <div className="neo-badge bg-lemon">{files.length} files</div>
      </div>

      {files.length === 0 ? (
        <div className="mt-6 neo-card bg-sky p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            Empty state
          </p>
          <p className="mt-3 text-base font-bold text-ink">
            Upload the first file into this location to populate the list.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {files.map((file) => (
            <article className="neo-card bg-sky p-5" key={file.id}>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
                {file.mimeType}
              </p>
              <h3 className="mt-3 break-words font-display text-2xl uppercase leading-none text-ink">
                {file.name}
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="neo-card bg-white p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
                    Size
                  </p>
                  <p className="mt-2 text-sm font-bold text-ink">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <div className="neo-card bg-white p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-ink">
                    Uploaded
                  </p>
                  <p className="mt-2 text-sm font-bold text-ink">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </article>
  );
}
