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
import { CreateFileDto } from './dto/create-file.dto';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { ShareFileDto } from './dto/share-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { type DownloadUrlResponse } from './interfaces/download-url-response.interface';
import { type FileListItem } from './interfaces/file-list-item.interface';
import { type ShareFileResponse } from './interfaces/share-file-response.interface';
import { FilesService } from './files.service';
import { type UploadUrlResponse } from './interfaces/upload-url-response.interface';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<FileListItem[]> {
    return this.filesService.findAllVisibleForUser(user.id);
  }

  @Post('upload-url')
  createUploadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createUploadUrlDto: CreateUploadUrlDto,
  ): Promise<UploadUrlResponse> {
    return this.filesService.createUploadUrl(user.id, createUploadUrlDto);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() createFileDto: CreateFileDto,
  ): Promise<FileListItem> {
    return this.filesService.createMetadataRecord(user.id, createFileDto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<FileListItem> {
    return this.filesService.update(user.id, id, updateFileDto);
  }

  @Get(':id/download-url')
  getDownloadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<DownloadUrlResponse> {
    return this.filesService.createDownloadUrl(user.id, id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.filesService.remove(user.id, id);
  }

  @Post(':id/share')
  share(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() shareFileDto: ShareFileDto,
  ): Promise<ShareFileResponse> {
    return this.filesService.share(user.id, id, shareFileDto);
  }
}
