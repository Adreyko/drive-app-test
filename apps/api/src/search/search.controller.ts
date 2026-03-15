import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthenticatedUser } from '../auth/interfaces/auth.types';
import { SearchWorkspaceDto } from './dto/search-workspace.dto';
import { type WorkspaceSearchResponse } from './interfaces/workspace-search-response.interface';
import { SearchService } from './search.service';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  searchWorkspace(
    @CurrentUser() user: AuthenticatedUser,
    @Query() searchWorkspaceDto: SearchWorkspaceDto,
  ): Promise<WorkspaceSearchResponse> {
    return this.searchService.searchWorkspace(user.id, searchWorkspaceDto.q ?? '');
  }
}
