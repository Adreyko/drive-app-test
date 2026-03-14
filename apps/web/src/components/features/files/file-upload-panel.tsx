'use client';

import { useId } from 'react';
import { Button } from '@/components/ui/button';

type FileUploadPanelProps = Readonly<{
  currentFolderName: string | null;
  errorMessage: string | null;
  isUploading: boolean;
  onChange: (file: globalThis.File | null) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  selectedFile: globalThis.File | null;
}>;

export function FileUploadPanel({
  currentFolderName,
  errorMessage,
  isUploading,
  onChange,
  onSubmit,
  selectedFile,
}: FileUploadPanelProps) {
  const inputId = useId();
  const inputKey = selectedFile
    ? `${selectedFile.name}-${selectedFile.lastModified}`
    : 'empty';

  return (
    <article className="neo-card bg-mint p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            Upload file
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
            Send To {currentFolderName ?? 'Root'}
          </h2>
          <p className="mt-3 max-w-xl text-sm font-bold text-ink/80">
            The browser uploads directly to S3 with a presigned `PUT` URL, then
            saves metadata in PostgreSQL.
          </p>
        </div>
        <div className="neo-badge bg-white">
          {selectedFile ? '1 file ready' : 'No file selected'}
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-[0.16em]" htmlFor={inputId}>
            Choose file
          </label>
          <input
            className="neo-input file:mr-4 file:rounded-xl file:border-0 file:bg-lemon file:px-4 file:py-2 file:text-sm file:font-black file:uppercase"
            disabled={isUploading}
            id={inputId}
            key={inputKey}
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
            type="file"
          />
        </div>

        {selectedFile ? (
          <div className="neo-card bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
              Selected
            </p>
            <p className="mt-2 text-sm font-bold text-ink">{selectedFile.name}</p>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="neo-card bg-blush p-4 text-sm font-bold text-ink">
            {errorMessage}
          </div>
        ) : null}

        <Button disabled={isUploading || !selectedFile} type="submit" variant="primary">
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </form>
    </article>
  );
}
