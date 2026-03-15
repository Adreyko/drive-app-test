'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { FileItem } from '@/api/files/files.model';
import type { FolderItem } from '@/api/folders/folders.model';
import type { WorkspaceSearchResponse } from '@/api/search/search.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';

type WorkspaceSearchProps = Readonly<{
  isLoading: boolean;
  onChange: (value: string) => void;
  onOpenFile: (file: FileItem) => void;
  onOpenFolder: (folderId: string) => void;
  onReset: () => void;
  query: string;
  results?: WorkspaceSearchResponse;
}>;

export function WorkspaceSearch({
  isLoading,
  onChange,
  onOpenFile,
  onOpenFolder,
  onReset,
  query,
  results,
}: WorkspaceSearchProps) {
  const trimmedQuery = query.trim();
  const shouldShowPanel = trimmedQuery.length > 0;
  const folderResults = results?.folders ?? [];
  const fileResults = results?.files ?? [];
  const hasResults = folderResults.length > 0 || fileResults.length > 0;
  const [isMounted, setIsMounted] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !shouldShowPanel) {
      return;
    }

    function updatePanelPosition() {
      const rect = anchorRef.current?.getBoundingClientRect();

      if (!rect) {
        setPanelStyle(null);
        return;
      }

      setPanelStyle({
        left: rect.left,
        top: rect.bottom + 8,
        width: rect.width,
      });
    }

    updatePanelPosition();
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);

    return () => {
      window.removeEventListener('resize', updatePanelPosition);
      window.removeEventListener('scroll', updatePanelPosition, true);
    };
  }, [isMounted, query, shouldShowPanel]);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2" ref={anchorRef}>
        <Input
          className="w-full"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search files and folders"
          value={query}
        />
        {trimmedQuery ? (
          <Button onClick={onReset} type="button" variant="secondary">
            Clear
          </Button>
        ) : null}
      </div>

      {isMounted && shouldShowPanel && panelStyle
        ? createPortal(
            <div
              className="neo-card fixed z-[130] max-h-[min(32rem,calc(100vh-7rem))] overflow-y-auto bg-white p-4 shadow-neo"
              style={panelStyle}
            >
              {trimmedQuery.length < 2 ? (
                <p className="text-sm font-medium text-ink">
                  Type at least 2 characters to search the workspace.
                </p>
              ) : null}

              {trimmedQuery.length >= 2 && isLoading ? (
                <p className="text-sm font-medium text-ink">Searching...</p>
              ) : null}

              {trimmedQuery.length >= 2 && !isLoading && !hasResults ? (
                <p className="text-sm font-medium text-ink">
                  No files or folders matched &quot;{trimmedQuery}&quot;.
                </p>
              ) : null}

              {trimmedQuery.length >= 2 && !isLoading && hasResults ? (
                <div className="space-y-4">
                  {folderResults.length > 0 ? (
                    <section className="space-y-2">
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
                        Folders
                      </p>
                      <div className="space-y-2">
                        {folderResults.map((folder) => (
                          <button
                            className="neo-card flex w-full items-center justify-between gap-3 bg-sky px-3 py-2 text-left"
                            key={folder.id}
                            onClick={() => onOpenFolder(folder.id)}
                            type="button"
                          >
                            <span className="text-sm font-medium text-ink" title={folder.name}>
                              {truncateLongWords(folder.name)}
                            </span>
                            <span className="text-[11px] font-semibold tracking-[0.08em] text-ink">
                              Open folder
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  {fileResults.length > 0 ? (
                    <section className="space-y-2">
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
                        Files
                      </p>
                      <div className="space-y-2">
                        {fileResults.map((file) => (
                          <button
                            className="neo-card flex w-full items-center justify-between gap-3 bg-lemon px-3 py-2 text-left"
                            key={file.id}
                            onClick={() => onOpenFile(file)}
                            type="button"
                          >
                            <div>
                              <p className="text-sm font-medium text-ink" title={file.name}>
                                {truncateLongWords(file.name)}
                              </p>
                              <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
                                {file.isOwned ? 'Your file' : 'Shared file'}
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold tracking-[0.08em] text-ink">
                              Open file
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
