'use client';

import { useId } from 'react';
import { fileUploadCopy } from '@/shared/features/files/constants/file-ui-copy';
import { Button } from '@/components/ui/button';

type FileUploadPanelProps = Readonly<{
  currentFolderName: string | null;
  errorMessage: string | null;
  isPublicView: boolean;
  isUploading: boolean;
  onChange: (file: globalThis.File | null) => void;
  onTogglePublicView: (isPublic: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  selectedFile: globalThis.File | null;
}>;

export function FileUploadPanel({
  currentFolderName,
  errorMessage,
  isPublicView,
  isUploading,
  onChange,
  onTogglePublicView,
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
            {fileUploadCopy.uploadEyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
            Send To {currentFolderName ?? 'Root'}
          </h2>
          <p className="mt-3 max-w-xl text-sm font-bold text-ink/80">
            {fileUploadCopy.uploadDescription}
          </p>
        </div>
        <div className="neo-badge bg-white">
          {selectedFile ? '1 file ready' : fileUploadCopy.noFileSelectedBadge}
        </div>
      </div>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-[0.16em]" htmlFor={inputId}>
            {fileUploadCopy.chooseFileLabel}
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
              {fileUploadCopy.selectedEyebrow}
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
            {fileUploadCopy.publicViewLabel}
          </span>
        </label>

        {errorMessage ? (
          <div className="neo-card bg-blush p-4 text-sm font-bold text-ink">
            {errorMessage}
          </div>
        ) : null}

        <Button disabled={isUploading || !selectedFile} type="submit" variant="primary">
          {isUploading
            ? fileUploadCopy.uploadButtonPending
            : fileUploadCopy.uploadButtonIdle}
        </Button>
      </form>
    </article>
  );
}
