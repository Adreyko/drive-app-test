import {
  BYTE_DISPLAY_UNITS,
  BYTE_SIZE_BASE,
  WHOLE_NUMBER_DISPLAY_THRESHOLD,
} from '@/shared/constants/format';

export function formatBytes(value: number): string {
  if (value < BYTE_SIZE_BASE) {
    return `${value} B`;
  }

  let size = value / BYTE_SIZE_BASE;
  let unitIndex = 0;

  while (size >= BYTE_SIZE_BASE && unitIndex < BYTE_DISPLAY_UNITS.length - 1) {
    size /= BYTE_SIZE_BASE;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= WHOLE_NUMBER_DISPLAY_THRESHOLD ? 0 : 1)} ${BYTE_DISPLAY_UNITS[unitIndex]}`;
}
