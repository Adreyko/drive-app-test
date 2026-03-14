'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

type ConfirmationModalProps = Readonly<{
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  isLoading?: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}>;

export function ConfirmationModal({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  description,
  isLoading = false,
  title,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isLoading) {
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
  }, [isLoading, onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="neo-card w-full max-w-2xl bg-cream p-6">
        <div className="space-y-4">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
            Confirm action
          </p>
          <h2 className="font-display text-4xl uppercase leading-none text-ink">
            {title}
          </h2>
          <p className="max-w-xl text-base font-bold text-ink/80">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button disabled={isLoading} onClick={() => void onConfirm()} variant="ink">
            {isLoading ? 'Working...' : confirmLabel}
          </Button>
          <Button disabled={isLoading} onClick={onClose} variant="secondary">
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
