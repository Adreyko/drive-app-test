import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { type AuthenticatedUser } from '../auth/interfaces/auth.types';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { File } from './entities/file.entity';
import { FilesService } from './files.service';
import { type UploadUrlResponse } from './interfaces/upload-url-response.interface';

@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<File[]> {
    return this.filesService.findAllForOwner(user.id);
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
  ): Promise<File> {
    return this.filesService.createMetadataRecord(user.id, createFileDto);
  }
}
