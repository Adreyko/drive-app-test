'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authQueryKeys } from '@/api/auth/auth.queries';
import { filesQueryKeys, useFilesQuery, useUploadFileMutation } from '@/api/files/files.queries';
import type { FileItem } from '@/api/files/files.model';
import {
  foldersQueryKeys,
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useFoldersQuery,
  useRenameFolderMutation,
} from '@/api/folders/folders.queries';
import type { FolderItem } from '@/api/folders/folders.model';
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import { FileList } from '@/components/features/files/file-list';
import { FileUploadPanel } from '@/components/features/files/file-upload-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clearAuthToken } from '@/lib/auth/token-storage';
import { FolderBreadcrumbs } from './folder-breadcrumbs';
import { FolderCard } from './folder-card';

function sortFolders(folders: FolderItem[]): FolderItem[] {
  return [...folders].sort((left, right) => left.name.localeCompare(right.name));
}

function buildBreadcrumbItems(
  folders: FolderItem[],
  currentFolderId: string | null,
): Array<{ id: string | null; name: string }> {
  const items: Array<{ id: string | null; name: string }> = [
    { id: null, name: 'Root' },
  ];

  if (!currentFolderId) {
    return items;
  }

  const foldersMap = new Map(folders.map((folder) => [folder.id, folder]));
  const path: FolderItem[] = [];
  let cursor = foldersMap.get(currentFolderId) ?? null;

  while (cursor) {
    path.unshift(cursor);
    cursor = cursor.parentId ? foldersMap.get(cursor.parentId) ?? null : null;
  }

  for (const folder of path) {
    items.push({ id: folder.id, name: folder.name });
  }

  return items;
}

type CurrentFolderPanelProps = Readonly<{
  currentFolder: FolderItem | null;
  errorMessage: string | null;
  isPending: boolean;
  onDeleteCurrentFolder: () => Promise<void>;
  onRenameCurrentFolder: (nextName: string) => Promise<void>;
  onSelectFolder: (folderId: string | null) => void;
  pathItems: Array<{ id: string | null; name: string }>;
}>;

function CurrentFolderPanel({
  currentFolder,
  errorMessage,
  isPending,
  onDeleteCurrentFolder,
  onRenameCurrentFolder,
  onSelectFolder,
  pathItems,
}: CurrentFolderPanelProps) {
  const [draftName, setDraftName] = useState(currentFolder?.name ?? '');

  useEffect(() => {
    setDraftName(currentFolder?.name ?? '');
  }, [currentFolder?.id, currentFolder?.name]);

  return (
    <section className="neo-card bg-sky p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              Current location
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
              {currentFolder?.name ?? 'Root Workspace'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-bold text-ink/80">
              {currentFolder
                ? 'You are inside a nested folder. Create more subfolders here or rename the current one.'
                : 'You are at the root level. Create top-level folders here and drill into them to build a hierarchy.'}
            </p>
          </div>

          <div className="neo-badge bg-white">
            {currentFolder ? 'Nested level' : 'Root level'}
          </div>
        </div>

        <FolderBreadcrumbs items={pathItems} onSelect={onSelectFolder} />

        {currentFolder ? (
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <Input
              disabled={isPending}
              onChange={(event) => setDraftName(event.target.value)}
              value={draftName}
            />
            <Button
              disabled={isPending || draftName.trim().length === 0}
              onClick={() => void onRenameCurrentFolder(draftName)}
              variant="primary"
            >
              Rename Current
            </Button>
            <Button
              disabled={isPending}
              onClick={() => void onDeleteCurrentFolder()}
              variant="ink"
            >
              Delete Current
            </Button>
          </div>
        ) : null}

        {errorMessage ? (
          <div className="neo-card bg-blush p-4 text-sm font-bold text-ink">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function FolderBrowser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const foldersQuery = useFoldersQuery();
  const filesQuery = useFilesQuery();
  const createFolderMutation = useCreateFolderMutation();
  const renameFolderMutation = useRenameFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();
  const uploadFileMutation = useUploadFileMutation();
  const folders = foldersQuery.data ?? [];
  const files = filesQuery.data ?? [];
  const currentFolder =
    folders.find((folder) => folder.id === currentFolderId) ?? null;
  const childFolders = sortFolders(
    folders.filter((folder) => folder.parentId === currentFolderId),
  );
  const visibleFiles = files.filter((file) => file.folderId === currentFolderId);
  const pathItems = buildBreadcrumbItems(folders, currentFolderId);
  const isMutating =
    createFolderMutation.isPending ||
    renameFolderMutation.isPending ||
    deleteFolderMutation.isPending ||
    uploadFileMutation.isPending;

  useEffect(() => {
    const authError = foldersQuery.error ?? filesQuery.error;

    if (authError && isUnauthorizedError(authError)) {
      clearAuthToken();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
      queryClient.removeQueries({ queryKey: foldersQueryKeys.all });
      queryClient.removeQueries({ queryKey: filesQueryKeys.all });
      router.replace('/login');
    }
  }, [filesQuery.error, foldersQuery.error, queryClient, router]);

  useEffect(() => {
    if (currentFolderId && !currentFolder) {
      setCurrentFolderId(null);
    }
  }, [currentFolder, currentFolderId]);

  async function handleCreateFolder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError(null);

    try {
      await createFolderMutation.mutateAsync({
        name: newFolderName.trim(),
        parentId: currentFolderId,
      });
      setNewFolderName('');
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not create folder.'));
    }
  }

  async function handleUploadFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile) {
      setActionError('Select a file before uploading.');

      return;
    }

    setActionError(null);

    try {
      await uploadFileMutation.mutateAsync({
        file: selectedFile,
        folderId: currentFolderId,
      });
      setSelectedFile(null);
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not upload file.'));
    }
  }

  async function handleRenameFolder(
    folder: FolderItem,
    nextName: string,
  ): Promise<boolean> {
    setActionError(null);

    try {
      await renameFolderMutation.mutateAsync({
        id: folder.id,
        name: nextName.trim(),
      });

      return true;
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not rename folder.'));

      return false;
    }
  }

  async function handleRenameCurrentFolder(nextName: string): Promise<void> {
    if (!currentFolder) {
      return;
    }

    await handleRenameFolder(currentFolder, nextName);
  }

  async function handleDeleteFolder(folder: FolderItem): Promise<void> {
    setActionError(null);

    try {
      await deleteFolderMutation.mutateAsync(folder.id);
      await queryClient.invalidateQueries({
        queryKey: filesQueryKeys.all,
      });

      if (currentFolderId === folder.id) {
        setCurrentFolderId(folder.parentId);
      }
    } catch (error) {
      setActionError(getApiErrorMessage(error, 'Could not delete folder.'));
    }
  }

  async function handleDeleteCurrentFolder(): Promise<void> {
    if (!currentFolder) {
      return;
    }

    if (
      !window.confirm(
        `Delete "${currentFolder.name}" and every nested subfolder inside it?`,
      )
    ) {
      return;
    }

    await handleDeleteFolder(currentFolder);
  }

  if (foldersQuery.isLoading) {
    return (
      <section className="neo-card bg-white p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
          Folder browser
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink">
          Loading folders
        </h2>
        <p className="mt-4 text-sm font-bold text-ink">
          Fetching your folder tree from `GET /folders`.
        </p>
      </section>
    );
  }

  if (foldersQuery.error && !isUnauthorizedError(foldersQuery.error)) {
    return (
      <section className="neo-card bg-white p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
          Folder browser
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink">
          Folder data unavailable
        </h2>
        <p className="mt-4 text-sm font-bold text-ink">
          {getApiErrorMessage(foldersQuery.error, 'Could not load folders.')}
        </p>
        <div className="mt-6">
          <Button onClick={() => void foldersQuery.refetch()} variant="secondary">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (filesQuery.error && !isUnauthorizedError(filesQuery.error)) {
    return (
      <section className="neo-card bg-white p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
          File browser
        </p>
        <h2 className="mt-3 font-display text-3xl uppercase text-ink">
          File data unavailable
        </h2>
        <p className="mt-4 text-sm font-bold text-ink">
          {getApiErrorMessage(filesQuery.error, 'Could not load files.')}
        </p>
        <div className="mt-6">
          <Button onClick={() => void filesQuery.refetch()} variant="secondary">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <CurrentFolderPanel
        currentFolder={currentFolder}
        errorMessage={actionError}
        isPending={isMutating}
        onDeleteCurrentFolder={handleDeleteCurrentFolder}
        onRenameCurrentFolder={handleRenameCurrentFolder}
        onSelectFolder={setCurrentFolderId}
        pathItems={pathItems}
      />

      <FileUploadPanel
        currentFolderName={currentFolder?.name ?? null}
        errorMessage={actionError}
        isUploading={uploadFileMutation.isPending}
        onChange={setSelectedFile}
        onSubmit={handleUploadFile}
        selectedFile={selectedFile}
      />

      <article className="neo-card bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              Create folder
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
              Add a new block
            </h2>
            <p className="mt-3 max-w-xl text-sm font-bold text-ink/80">
              New folders are created inside{' '}
              <span className="underline">
                {currentFolder?.name ?? 'the root workspace'}
              </span>
              .
            </p>
          </div>

          <div className="neo-badge bg-lemon">{folders.length} total folders</div>
        </div>

        <form
          className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]"
          onSubmit={handleCreateFolder}
        >
          <Input
            disabled={isMutating}
            onChange={(event) => setNewFolderName(event.target.value)}
            placeholder="Invoices, Contracts, Design System..."
            required
            value={newFolderName}
          />
          <Button
            disabled={isMutating || newFolderName.trim().length === 0}
            type="submit"
            variant="primary"
          >
            {createFolderMutation.isPending ? 'Creating...' : 'Create Folder'}
          </Button>
        </form>
      </article>

      <FileList currentFolderName={currentFolder?.name ?? null} files={visibleFiles} />

      <article className="neo-card bg-blush p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              Visible folders
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none text-ink">
              {currentFolder?.name ?? 'Root'} Contents
            </h2>
          </div>
          <div className="neo-badge bg-white">{childFolders.length} shown</div>
        </div>

        {childFolders.length === 0 ? (
          <div className="mt-6 neo-card bg-white p-8">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              Empty state
            </p>
            <p className="mt-3 max-w-xl text-base font-bold text-ink">
              {currentFolder
                ? 'This folder has no children yet. Create the first nested folder above.'
                : 'You have no folders yet. Create the first root folder above to start building the tree.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {childFolders.map((folder) => (
              <FolderCard
                childCount={
                  folders.filter((candidate) => candidate.parentId === folder.id).length
                }
                folder={folder}
                key={folder.id}
                onDelete={handleDeleteFolder}
                onOpen={setCurrentFolderId}
                onRename={handleRenameFolder}
              />
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
