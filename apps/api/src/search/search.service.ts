import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { FoldersService } from '../folders/folders.service';
import { type WorkspaceSearchResponse } from './interfaces/workspace-search-response.interface';

@Injectable()
export class SearchService {
  constructor(
    private readonly filesService: FilesService,
    private readonly foldersService: FoldersService,
  ) {}

  async searchWorkspace(
    userId: string,
    query: string,
  ): Promise<WorkspaceSearchResponse> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return {
        query: '',
        files: [],
        folders: [],
      };
    }

    const [folders, files] = await Promise.all([
      this.foldersService.searchForOwner(userId, normalizedQuery),
      this.filesService.searchVisibleForUser(userId, normalizedQuery),
    ]);

    return {
      query: normalizedQuery,
      files,
      folders,
    };
  }
}
