'use client';

import { useCallback, useState } from 'react';

type UseDisclosureOptions = Readonly<{
  initialOpen?: boolean;
}>;

export function useDisclosure({
  initialOpen = false,
}: UseDisclosureOptions = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback((): void => {
    setIsOpen(true);
  }, []);

  const close = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback((): void => {
    setIsOpen((current) => !current);
  }, []);

  return {
    close,
    isOpen,
    open,
    setIsOpen,
    toggle,
  };
}

export type DisclosureState = ReturnType<typeof useDisclosure>;
