import { StatePanel } from '@/components/ui/state-panel';
import type { DriveWorkspaceFilesSection } from '@/shared/features/drive/hooks/use-drive-workspace';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import { FileCard } from './file-card';

type FileListProps = Readonly<{
  section: DriveWorkspaceFilesSection;
}>;

export function FileList({ section }: FileListProps) {
  const locationLabel = truncateLongWords(section.currentFolderName ?? 'Root');

  return (
    <article className="neo-card bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-ink">
            Files
          </p>
          <h2
            className="mt-1 font-display text-xl leading-tight text-ink md:text-2xl"
            title={`${section.currentFolderName ?? 'Root'} Files`}
          >
            {locationLabel} Files
          </h2>
        </div>
        <div className="neo-badge bg-lemon">{section.files.length} files</div>
      </div>

      {section.files.length === 0 ? null : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {section.files.map((file) => (
            <FileCard
              file={file}
              folderOptions={section.folderOptions}
              key={file.id}
              onDelete={section.onDelete}
              onOpen={section.onOpen}
              onShare={section.onShare}
              onUpdate={section.onUpdate}
            />
          ))}
        </div>
      )}
      {section.files.length === 0 ? (
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
