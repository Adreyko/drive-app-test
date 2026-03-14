export const fileUploadCopy = {
  chooseFileLabel: 'Choose file',
  noFileSelectedBadge: 'No file selected',
  publicViewLabel:
    'Public view: every authenticated user can see and preview this file.',
  selectedEyebrow: 'Selected',
  uploadButtonIdle: 'Upload File',
  uploadButtonPending: 'Uploading...',
  uploadDescription:
    'The browser uploads directly to S3 with a presigned `PUT` URL, then saves metadata in PostgreSQL.',
  uploadEyebrow: 'Upload file',
} as const;

export const ownedFilesCopy = {
  emptyDescription: 'Upload the first file into this location to populate the list.',
  emptyEyebrow: 'Empty state',
  filesSuffix: 'Files',
  sectionEyebrow: 'Owned files',
} as const;

export const sharedFilesCopy = {
  emptyDescription:
    'Files other users share with you, or mark as public, will appear here.',
  emptyEyebrow: 'Empty state',
  sectionDescription:
    'Shared files and public files from other users are listed here outside your folder tree. Editors can rename explicit shares, while public files stay viewer-only.',
  sectionEyebrow: 'Shared or public',
  sectionTitle: 'Incoming Files',
} as const;

export const fileCardCopy = {
  accessLabel: 'Access',
  cancelButtonLabel: 'Cancel',
  deleteButtonLabel: 'Delete',
  deleteConfirmLabel: 'Delete File',
  deleteTitle: 'Delete File?',
  locationLabel: 'Location',
  ownerLabel: 'Owner',
  previewButtonLabel: 'Preview',
  publicViewToggleLabel: 'Public view for every authenticated user',
  renameButtonLabel: 'Rename',
  renameOrMoveButtonLabel: 'Rename Or Move',
  saveButtonIdle: 'Save',
  saveButtonPending: 'Saving...',
  shareButtonLabel: 'Share',
  sizeLabel: 'Size',
  updatedLabel: 'Updated',
  visibilityLabel: 'Visibility',
} as const;
