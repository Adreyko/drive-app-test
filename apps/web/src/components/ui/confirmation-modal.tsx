'use client';

import { Button } from '@/components/ui/button';
import { ModalShell } from '@/components/ui/modal-shell';

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
  return (
    <ModalShell
      description={description}
      eyebrow="Confirm action"
      footer={
        <div className="flex flex-wrap gap-3">
          <Button
            disabled={isLoading}
            onClick={() => void onConfirm()}
            variant="ink"
          >
            {isLoading ? 'Working...' : confirmLabel}
          </Button>
          <Button disabled={isLoading} onClick={onClose} variant="secondary">
            {cancelLabel}
          </Button>
        </div>
      }
      isDismissible={!isLoading}
      onClose={onClose}
      title={title}
      tone="blush"
    />
  );
}
