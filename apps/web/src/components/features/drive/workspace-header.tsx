'use client';

import type { AuthUser } from '@/api/auth/auth.model';
import type { FileItem } from '@/api/files/files.model';
import type { WorkspaceSearchResponse } from '@/api/search/search.model';
import { Button } from '@/components/ui/button';
import { WorkspaceSearch } from './workspace-search';

type WorkspaceHeaderProps = Readonly<{
  isSigningOut: boolean;
  isSearchLoading: boolean;
  onOpenSearchFile: (file: FileItem) => void;
  onOpenSearchFolder: (folderId: string) => void;
  onResetSearch: () => void;
  onSearchChange: (value: string) => void;
  onSignOut: () => void;
  searchQuery: string;
  searchResults?: WorkspaceSearchResponse;
  user: AuthUser;
}>;

export function WorkspaceHeader({
  isSigningOut,
  isSearchLoading,
  onOpenSearchFile,
  onOpenSearchFolder,
  onResetSearch,
  onSearchChange,
  onSignOut,
  searchQuery,
  searchResults,
  user,
}: WorkspaceHeaderProps) {
  const userInitial = user.email.charAt(0).toUpperCase() || '?';

  return (
    <header className="neo-card bg-white p-4 md:p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.08em] text-ink">
            Drive
          </p>
          <h1 className="mt-2 font-display text-2xl leading-tight text-ink md:text-3xl">
            Files And Folders
          </h1>
        </div>

        <WorkspaceSearch
          isLoading={isSearchLoading}
          onChange={onSearchChange}
          onOpenFile={onOpenSearchFile}
          onOpenFolder={onOpenSearchFolder}
          onReset={onResetSearch}
          query={searchQuery}
          results={searchResults}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="neo-card flex items-center gap-3 bg-sky px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white font-display text-xl text-ink">
              {userInitial}
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.08em] text-ink">
                Profile
              </p>
              <p className="text-sm font-medium text-ink">{user.email}</p>
            </div>
          </div>

          <Button disabled={isSigningOut} onClick={onSignOut} variant="ink">
            {isSigningOut ? 'Logging Out...' : 'Log Out'}
          </Button>
        </div>
      </div>
    </header>
  );
}
