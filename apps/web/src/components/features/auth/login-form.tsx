'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { authQueryKeys, useLoginMutation } from '@/api/auth/auth.queries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setAuthToken } from '@/lib/auth/token-storage';
import { AuthFormShell } from './auth-form-shell';

type LoginFormProps = Readonly<{
  redirectTo: string;
}>;

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const [isRouting, startRouting] = useTransition();
  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const response = await loginMutation.mutateAsync(formState);

      setAuthToken(response.accessToken);
      queryClient.setQueryData(authQueryKeys.me(), response.user);
      startRouting(() => router.replace(redirectTo));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not log in.');
    }
  }

  const isBusy = loginMutation.isPending || isRouting;

  return (
    <AuthFormShell
      accentClassName="bg-sky"
      alternateAction={
        <p className="text-sm font-bold text-ink">
          Need an account?{' '}
          <Link className="underline decoration-4 underline-offset-4" href="/register">
            Register here
          </Link>
          .
        </p>
      }
      badge="Login"
      description="Sign in to manage your folders, files, and shares."
      title="Welcome Back"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-[0.16em]" htmlFor="email">
            Email
          </label>
          <Input
            autoComplete="email"
            id="email"
            name="email"
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            placeholder="you@example.com"
            required
            type="email"
            value={formState.email}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-[0.16em]" htmlFor="password">
            Password
          </label>
          <Input
            autoComplete="current-password"
            id="password"
            minLength={8}
            name="password"
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            placeholder="Your password"
            required
            type="password"
            value={formState.password}
          />
        </div>

        {errorMessage ? (
          <div className="neo-card bg-blush p-4 text-sm font-bold">{errorMessage}</div>
        ) : null}

        <Button disabled={isBusy} fullWidth type="submit" variant="primary">
          {isBusy ? 'Logging In...' : 'Log In'}
        </Button>
      </form>
    </AuthFormShell>
  );
}
