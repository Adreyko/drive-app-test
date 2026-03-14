export enum FileAccessRole {
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export type ResolvedFileAccessRole = 'owner' | FileAccessRole;
