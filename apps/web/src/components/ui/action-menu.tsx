'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useDisclosure } from '@/shared/hooks/use-disclosure';

type ActionMenuItem = Readonly<{
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onSelect: () => void;
}>;

type ActionMenuProps = Readonly<{
  compact?: boolean;
  items: ActionMenuItem[];
  label?: string;
}>;

export function ActionMenu({
  compact = false,
  items,
  label = 'More actions',
}: ActionMenuProps) {
  const menu = useDisclosure();
  const isOpen = menu.isOpen;
  const closeMenu = menu.close;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    }

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={label}
        className={cn(
          'neo-button bg-white px-0 text-base leading-none tracking-normal',
          compact ? 'h-9 w-9 text-sm' : 'h-10 w-10',
        )}
        onClick={menu.toggle}
        type="button"
      >
        ...
      </button>

      {isOpen ? (
        <div
          className="neo-card absolute right-0 top-full z-20 mt-2 min-w-48 overflow-hidden bg-white p-2"
          role="menu"
        >
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <button
                className={cn(
                  'rounded-[16px] border-2 border-black text-left font-semibold tracking-[0.04em] shadow-neoSm transition-transform duration-150 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60',
                  compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm',
                  item.danger ? 'bg-blush text-ink' : 'bg-white text-ink',
                )}
                disabled={item.disabled}
                key={item.label}
                onClick={() => {
                  closeMenu();
                  item.onSelect();
                }}
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
