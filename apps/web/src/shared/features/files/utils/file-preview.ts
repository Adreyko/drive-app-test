import type { FileItem } from '@/api/files/files.model';

const INLINE_PREVIEW_MIME_TYPES = new Set([
  'application/pdf',
  'application/json',
  'application/xml',
  'text/plain',
  'text/html',
  'text/css',
  'text/csv',
  'text/markdown',
]);

const DOWNLOAD_ONLY_EXTENSIONS = new Set([
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
]);

export function supportsInlineFilePreview(
  file: Pick<FileItem, 'mimeType' | 'name'>,
): boolean {
  if (file.mimeType.startsWith('image/')) {
    return true;
  }

  if (file.mimeType.startsWith('text/')) {
    return true;
  }

  if (INLINE_PREVIEW_MIME_TYPES.has(file.mimeType)) {
    return true;
  }

  return !DOWNLOAD_ONLY_EXTENSIONS.has(getFileExtension(file.name));
}

function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.at(-1) ?? '' : '';
}
