'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { authQueryKeys, useMeQuery } from '@/api/auth/auth.queries';
import { getApiErrorMessage, isUnauthorizedError } from '@/api/client';
import { FolderBrowser } from '@/components/features/folders/folder-browser';
import { Button } from '@/components/ui/button';
import { clearAuthToken } from '@/lib/auth/token-storage';

const workspaceRules = [
  'Create nested folders from any current location',
  'Upload directly to S3 with a presigned URL',
  'Mark owned files public for every authenticated user',
  'Share files by email with viewer or editor roles',
  'See owned files plus incoming shared/public files in one dashboard',
];

export function DashboardShell() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, startSigningOut] = useTransition();
  const { data: user, error, isLoading, refetch } = useMeQuery();

  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      clearAuthToken();
      queryClient.removeQueries({ queryKey: authQueryKeys.all });
      router.replace('/login');
    }
  }, [error, queryClient, router]);

  function handleSignOut() {
    clearAuthToken();
    queryClient.removeQueries({ queryKey: authQueryKeys.all });
    startSigningOut(() => router.replace('/login'));
  }

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8 md:py-10">
        <section className="neo-card w-full bg-sky p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em]">
            Loading session
          </p>
          <h1 className="mt-3 font-display text-4xl uppercase">Checking Access</h1>
          <p className="mt-4 max-w-xl text-lg font-bold">
            The dashboard is verifying your JWT session with `GET /auth/me`.
          </p>
        </section>
      </main>
    );
  }

  if (!user && error && !isUnauthorizedError(error)) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-8 md:py-10">
        <section className="neo-card w-full bg-blush p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em]">
            Dashboard error
          </p>
          <h1 className="mt-3 font-display text-4xl uppercase">Session Check Failed</h1>
          <p className="mt-4 max-w-xl text-lg font-bold">
            {getApiErrorMessage(error, 'Could not verify the current user.')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => void refetch()} variant="secondary">
              Retry
            </Button>
            <Button onClick={handleSignOut} variant="ink">
              Back to login
            </Button>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <section className="neo-card bg-mint p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <span className="neo-badge bg-white">Phase 6 / Sharing + Permissions</span>
            <div>
              <h1 className="font-display text-4xl uppercase leading-none md:text-6xl">
                Build Your Storage Grid.
              </h1>
              <p className="mt-4 max-w-2xl text-lg font-bold text-ink">
                You are authenticated as <span className="underline">{user.email}</span>.
                This phase adds file sharing by email, viewer and editor roles,
                and a combined dashboard view for files you own and files other
                users shared with you.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="neo-button bg-white" href="/">
              Home
            </Link>
            <Button disabled={isSigningOut} onClick={handleSignOut} variant="ink">
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.4fr_0.6fr]">
        <div className="space-y-6">
          <article className="neo-card bg-white p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              Current Session
            </p>
            <div className="mt-5 space-y-4">
              <div className="neo-card bg-lemon p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
                  User ID
                </p>
                <p className="mt-2 break-all text-sm font-bold text-ink">{user.id}</p>
              </div>

              <div className="neo-card bg-sky p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-ink">
                  Created At
                </p>
                <p className="mt-2 text-sm font-bold text-ink">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </article>

          <article className="neo-card bg-blush p-6">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
              Workspace Rules
            </p>
            <div className="mt-5 space-y-4">
              {workspaceRules.map((rule) => (
                <div key={rule} className="neo-card bg-white p-4">
                  <p className="text-sm font-bold text-ink">{rule}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <FolderBrowser />
      </section>
    </main>
  );
}
