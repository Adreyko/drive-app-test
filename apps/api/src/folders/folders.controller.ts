import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthenticatedUser } from '../auth/interfaces/auth.types';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from './entities/folder.entity';
import { FoldersService } from './folders.service';

@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createFolderDto: CreateFolderDto,
  ): Promise<Folder> {
    return this.foldersService.create(user.id, createFolderDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<Folder[]> {
    return this.foldersService.findAllForOwner(user.id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFolderDto: UpdateFolderDto,
  ): Promise<Folder> {
    return this.foldersService.rename(user.id, id, updateFolderDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.foldersService.remove(user.id, id);
  }
}
