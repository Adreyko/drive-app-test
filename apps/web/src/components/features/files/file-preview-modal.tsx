'use client';

import type { FileItem } from '@/api/files/files.model';
import { Button } from '@/components/ui/button';
import { ModalShell } from '@/components/ui/modal-shell';
import { supportsInlineFilePreview } from '@/shared/features/files/utils/file-preview';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';

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
  const fileLabel = truncateLongWords(file.name);
  const canPreviewInline = supportsInlineFilePreview(file);
  const rawFileActionLabel = canPreviewInline ? 'Open Raw File' : 'Download File';

  return (
    <ModalShell
      bodyClassName="bg-white p-4"
      description={
        canPreviewInline
          ? 'The preview stays inside the app. If the browser cannot render this file type inline, use the raw file link below.'
          : 'This file type is available only as a download.'
      }
      eyebrow="File preview"
      headerActions={
        <>
          <a
            className="neo-button bg-white"
            href={previewUrl}
            rel="noreferrer"
            target="_blank"
          >
            {rawFileActionLabel}
          </a>
          <Button onClick={onClose} variant="ink">
            Close
          </Button>
        </>
      }
      onClose={onClose}
      size="xl"
      title={fileLabel}
      tone="lemon"
    >
      {canPreviewInline ? (
        <div className="flex h-[60vh] flex-col gap-4 lg:h-[68vh]">
          <iframe
            className="h-full w-full rounded-[18px] border-2 border-black bg-white"
            src={previewUrl}
            title={`Preview ${file.name}`}
          />
          <div className="neo-card bg-sky p-4 text-sm font-bold text-ink">
            Inline preview depends on browser support for the current file type. If the frame looks blank, use `Open Raw File`.
          </div>
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col justify-center gap-4">
          <div className="neo-card bg-sky p-5 text-sm font-medium text-ink">
            This file type cannot be previewed inside the app. Download it to open it in Microsoft Word or another compatible document app.
          </div>
          <div className="neo-card bg-white p-5 text-sm font-medium text-ink">
            Supported here: images, PDFs, and browser-friendly text files. Word-style documents such as `.doc` and `.docx` are download only.
          </div>
        </div>
      )}
    </ModalShell>
  );
}
