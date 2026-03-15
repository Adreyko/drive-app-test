'use client';

import { useEffect, useState } from 'react';

type UseDebouncedValueOptions = Readonly<{
  delay?: number;
}>;

export function useDebouncedValue<T>(
  value: T,
  { delay = 300 }: UseDebouncedValueOptions = {},
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, value]);

  return debouncedValue;
}
