'use client';

import { useState } from 'react';
import { getApiErrorMessage } from '@/api/client';
import type { FileItem } from '@/api/files/files.model';
import type { ShareRole } from '@/api/sharing/sharing.model';
import { truncateLongWords } from '@/shared/utils/truncate-long-words';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalShell } from '@/components/ui/modal-shell';

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
  const fileLabel = truncateLongWords(file.name);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ShareRole>('viewer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <ModalShell
      description="Invite another registered user by email and assign a viewer or editor role."
      eyebrow="Share file"
      isDismissible={!isSubmitting}
      onClose={onClose}
      title={`Share ${fileLabel}`}
      tone="mint"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
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
            <Button
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
      </form>
    </ModalShell>
  );
}
