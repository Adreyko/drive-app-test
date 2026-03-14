const MAX_WORD_LENGTH = 15;

export function truncateLongWords(
  value: string,
  maxWordLength: number = MAX_WORD_LENGTH,
): string {
  return value
    .split(/(\s+)/)
    .map((part) => {
      if (!part.trim()) {
        return part;
      }

      return part.length > maxWordLength
        ? `${part.slice(0, maxWordLength)}...`
        : part;
    })
    .join('');
}
