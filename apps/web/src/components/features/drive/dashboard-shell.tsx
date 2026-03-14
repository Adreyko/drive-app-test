'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useMeQuery } from '@/api/auth/auth.queries';
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import { FolderBrowser } from '@/components/features/folders/folder-browser';
import { WorkspaceHeader } from '@/components/features/drive/workspace-header';
import { StatePanel } from '@/components/ui/state-panel';
import { Button } from '@/components/ui/button';
import { clearAuthSession } from '@/shared/auth/clear-auth-session';
import { useUnauthorizedRedirect } from '@/shared/hooks/use-unauthorized-redirect';

export function DashboardShell() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, startSigningOut] = useTransition();
  const { data: user, error, isLoading, refetch } = useMeQuery();

  useUnauthorizedRedirect(error);

  function handleSignOut() {
    clearAuthSession(queryClient);
    startSigningOut(() => router.replace('/login'));
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8 md:py-10">
        <StatePanel
          badge="Workspace"
          className="w-full"
          description="Checking your account before opening the workspace."
          eyebrow="Account"
          title="Opening Workspace"
          tone="sky"
        />
      </main>
    );
  }

  if (!user && error && !isUnauthorizedError(error)) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8 md:py-10">
        <StatePanel
          action={
            <>
            <Button onClick={() => void refetch()} variant="secondary">
              Retry
            </Button>
            <Button onClick={handleSignOut} variant="ink">
              Back to login
            </Button>
            </>
          }
          badge="Session"
          className="w-full"
          description={getApiErrorMessage(error, 'Could not verify the current account.')}
          eyebrow="Account"
          title="Workspace Unavailable"
          tone="blush"
        />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <WorkspaceHeader
        isSigningOut={isSigningOut}
        onSignOut={handleSignOut}
        user={user}
      />

      <FolderBrowser />
    </main>
  );
}
