'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

type ModalShellTone = 'white' | 'lemon' | 'mint' | 'sky' | 'blush';
type ModalShellSize = 'md' | 'lg' | 'xl';

type ModalShellProps = Readonly<{
  bodyClassName?: string;
  children?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow: string;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  isDismissible?: boolean;
  onClose: () => void;
  size?: ModalShellSize;
  title: React.ReactNode;
  tone?: ModalShellTone;
}>;

const toneClassNames: Record<ModalShellTone, string> = {
  white: 'bg-white',
  lemon: 'bg-lemon',
  mint: 'bg-mint',
  sky: 'bg-sky',
  blush: 'bg-blush',
};

const sizeClassNames: Record<ModalShellSize, string> = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

export function ModalShell({
  bodyClassName,
  children,
  description,
  eyebrow,
  footer,
  headerActions,
  isDismissible = true,
  onClose,
  size = 'md',
  title,
  tone = 'lemon',
}: ModalShellProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isDismissible) {
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
  }, [isDismissible, isMounted, onClose]);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div
      className="neo-modal-backdrop fixed inset-0 z-[120] overflow-y-auto"
      onClick={isDismissible ? () => onClose() : undefined}
    >
      <div className="flex min-h-full items-start justify-center p-4 md:items-center md:p-6">
        <div
          aria-modal="true"
          className={cn('neo-modal-shell w-full', sizeClassNames[size])}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
        >
          <div
            className={cn(
              'border-b-2 border-black p-5 md:p-6',
              toneClassNames[tone],
            )}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-ink">
                  {eyebrow}
                </p>
                <h2 className="font-display text-2xl leading-tight text-ink md:text-3xl">
                  {title}
                </h2>
                {description ? (
                  <p className="max-w-2xl text-sm font-medium text-ink/80 md:text-base">
                    {description}
                  </p>
                ) : null}
              </div>

              {headerActions ? (
                <div className="flex flex-wrap gap-3">{headerActions}</div>
              ) : null}
            </div>
          </div>

          {children ? <div className={cn('p-5 md:p-6', bodyClassName)}>{children}</div> : null}

          {footer ? (
            <div className="border-t-2 border-black bg-white/75 p-5 md:p-6">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
