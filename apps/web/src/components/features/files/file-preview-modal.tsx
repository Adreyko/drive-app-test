'use client';

import type { FileItem } from '@/api/files/files.model';
import { Button } from '@/components/ui/button';

type FilePreviewModalProps = Readonly<{
  file: FileItem;
  previewUrl: string;
  onClose: () => void;
}>;

export function FilePreviewModal({
  file,
  previewUrl,
  onClose,
}: FilePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="neo-card flex h-[85vh] w-full max-w-6xl flex-col overflow-hidden bg-cream">
        <div className="flex flex-col gap-4 border-b-4 border-black bg-lemon p-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              File preview
            </p>
            <h2 className="mt-2 break-words font-display text-3xl uppercase leading-none text-ink">
              {file.name}
            </h2>
            <p className="mt-3 text-sm font-bold text-ink/80">
              The preview stays inside the dashboard. If the browser cannot render this
              file type inline, use the raw file link below.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              className="neo-button bg-white"
              href={previewUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open Raw File
            </a>
            <Button onClick={onClose} variant="ink">
              Close
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-white p-4">
          <iframe
            className="h-full w-full rounded-[1.5rem] border-4 border-black bg-white"
            src={previewUrl}
            title={`Preview ${file.name}`}
          />
        </div>
      </div>
    </div>
  );
}
