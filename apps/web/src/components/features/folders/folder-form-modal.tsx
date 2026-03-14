'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalShell } from '@/components/ui/modal-shell';

type FolderFormModalProps = Readonly<{
  description: string;
  initialName?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  submitLabel: string;
  title: string;
}>;

export function FolderFormModal({
  description,
  initialName = '',
  isSubmitting,
  onClose,
  onSubmit,
  submitLabel,
  title,
}: FolderFormModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(name);
  }

  return (
    <ModalShell
      description={description}
      eyebrow="Folder"
      isDismissible={!isSubmitting}
      onClose={onClose}
      title={title}
      tone="sky"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          autoFocus
          disabled={isSubmitting}
          onChange={(event) => setName(event.target.value)}
          placeholder="Folder name"
          required
          value={name}
        />

        <div className="flex flex-wrap gap-3">
          <Button disabled={isSubmitting || name.trim().length === 0} type="submit" variant="primary">
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </ModalShell>
  );
}
