'use client';

import type { FileItem } from '@/api/files/files.model';
import { Button } from '@/components/ui/button';
import { ModalShell } from '@/components/ui/modal-shell';
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

  return (
    <ModalShell
      bodyClassName="bg-white p-4"
      description="The preview stays inside the app. If the browser cannot render this file type inline, use the raw file link below."
      eyebrow="File preview"
      headerActions={
        <>
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
        </>
      }
      onClose={onClose}
      size="xl"
      title={fileLabel}
      tone="lemon"
    >
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
    </ModalShell>
  );
}
