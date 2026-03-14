'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { ModalShell } from '@/components/ui/modal-shell';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';

type FileUploadModalProps = Readonly<{
  currentFolderName: string | null;
  errorMessage: string | null;
  isPublicView: boolean;
  isUploading: boolean;
  onChange: (file: globalThis.File | null) => void;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
  onTogglePublicView: (isPublic: boolean) => void;
  selectedFile: globalThis.File | null;
}>;

export function FileUploadModal({
  currentFolderName,
  errorMessage,
  isPublicView,
  isUploading,
  onChange,
  onClose,
  onSubmit,
  onTogglePublicView,
  selectedFile,
}: FileUploadModalProps) {
  const folderLabel = truncateLongWords(currentFolderName ?? 'Root');
  const inputId = useId();
  const inputKey = selectedFile
    ? `${selectedFile.name}-${selectedFile.lastModified}`
    : 'empty';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const uploaded = await onSubmit();

    if (uploaded) {
      onClose();
    }
  }

  return (
    <ModalShell
      description={`Upload a file to ${currentFolderName ?? 'Root'} and choose who can see it.`}
      eyebrow="Upload file"
      isDismissible={!isUploading}
      onClose={onClose}
      title={`Upload To ${folderLabel}`}
      tone="mint"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3">
          <label className="text-xs font-black uppercase tracking-[0.16em]" htmlFor={inputId}>
            Choose file
          </label>
          <div className="neo-badge bg-white">
            {selectedFile ? '1 file ready' : 'No file selected'}
          </div>
        </div>

        <input
          className="neo-input file:mr-4 file:rounded-xl file:border-0 file:bg-lemon file:px-4 file:py-2 file:text-sm file:font-black file:uppercase"
          disabled={isUploading}
          id={inputId}
          key={inputKey}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          type="file"
        />

        {selectedFile ? (
          <div className="neo-card bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
              Selected
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{selectedFile.name}</p>
          </div>
        ) : null}

        <label className="neo-card flex items-center gap-3 bg-white p-4">
          <input
            checked={isPublicView}
            className="h-5 w-5 accent-black"
            disabled={isUploading}
            onChange={(event) => onTogglePublicView(event.target.checked)}
            type="checkbox"
          />
          <span className="text-sm font-bold text-ink">
            Visible to every signed-in user
          </span>
        </label>

        {errorMessage ? (
          <div className="neo-card bg-blush p-4 text-sm font-bold text-ink">
            {errorMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button disabled={isUploading || !selectedFile} type="submit" variant="primary">
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
          <Button disabled={isUploading} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
