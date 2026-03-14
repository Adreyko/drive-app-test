'use client';

import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '@/api/client';
import type { FileItem } from '@/api/files/files.model';
import type { ShareRole } from '@/api/sharing/sharing.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ShareFileModalProps = Readonly<{
  file: FileItem;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: { email: string; role: ShareRole }) => Promise<void>;
}>;

export function ShareFileModal({
  file,
  isSubmitting,
  onClose,
  onSubmit,
}: ShareFileModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ShareRole>('viewer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitting, onClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await onSubmit({
        email: email.trim(),
        role,
      });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Could not share file.'));
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="neo-card w-full max-w-2xl bg-cream p-6">
        <div className="space-y-4">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            Share file
          </p>
          <h2 className="font-display text-4xl uppercase leading-none text-ink">
            Share {file.name}
          </h2>
          <p className="max-w-xl text-base font-bold text-ink/80">
            Invite another registered user by email and assign a viewer or editor role.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            disabled={isSubmitting}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teammate@example.com"
            required
            type="email"
            value={email}
          />

          <select
            className="neo-input"
            disabled={isSubmitting}
            onChange={(event) => setRole(event.target.value as ShareRole)}
            value={role}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>

          {errorMessage ? (
            <div className="neo-card bg-blush p-4 text-sm font-bold text-ink">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button disabled={isSubmitting} type="submit" variant="primary">
              {isSubmitting ? 'Sharing...' : 'Share File'}
            </Button>
            <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
