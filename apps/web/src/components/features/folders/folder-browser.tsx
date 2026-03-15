'use client';

import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import { DriveWorkspaceModalStack } from '@/components/features/drive/drive-workspace-modal-stack';
import { FileList } from '@/components/features/files/file-list';
import { SharedFilesPanel } from '@/components/features/files/shared-files-panel';
import { Button } from '@/components/ui/button';
import { StatePanel } from '@/components/ui/state-panel';
import { useDriveWorkspace } from '@/shared/features/drive/hooks/use-drive-workspace';
import { CurrentFolderPanel } from './current-folder-panel';
import { FoldersSection } from './folders-section';

export function FolderBrowser() {
  const workspace = useDriveWorkspace();

  if (workspace.status.isLoading) {
    return (
      <StatePanel
        badge="Folders"
        description="Loading your folders."
        eyebrow="Folders"
        title="Loading folders"
      />
    );
  }

  if (
    workspace.status.folderError &&
    !isUnauthorizedError(workspace.status.folderError)
  ) {
    return (
      <StatePanel
        action={
          <Button
            onClick={() => void workspace.status.refetchFolders()}
            variant="secondary"
          >
            Retry
          </Button>
        }
        badge="Folders"
        description={getApiErrorMessage(
          workspace.status.folderError,
          'Could not load folders.',
        )}
        eyebrow="Folders"
        title="Folder data unavailable"
        tone="blush"
      />
    );
  }

  if (
    workspace.status.fileError &&
    !isUnauthorizedError(workspace.status.fileError)
  ) {
    return (
      <StatePanel
        action={
          <Button
            onClick={() => void workspace.status.refetchFiles()}
            variant="secondary"
          >
            Retry
          </Button>
        }
        badge="Files"
        description={getApiErrorMessage(
          workspace.status.fileError,
          'Could not load files.',
        )}
        eyebrow="Files"
        title="File data unavailable"
        tone="blush"
      />
    );
  }

  return (
    <section className="space-y-6">
      <CurrentFolderPanel panel={workspace.currentFolderPanel} />
      <FoldersSection section={workspace.foldersSection} />
      <FileList section={workspace.filesSection} />
      <SharedFilesPanel section={workspace.sharedFilesSection} />
      <DriveWorkspaceModalStack modals={workspace.modals} />
    </section>
  );
}
