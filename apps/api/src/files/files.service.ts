import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { File } from './entities/file.entity';
import { type UploadUrlResponse } from './interfaces/upload-url-response.interface';
import { S3StorageService } from './s3-storage.service';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
    @InjectRepository(Folder)
    private readonly foldersRepository: Repository<Folder>,
    private readonly s3StorageService: S3StorageService,
  ) {}

  findAllForOwner(ownerId: string): Promise<File[]> {
    return this.filesRepository.find({
      where: { ownerId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createUploadUrl(
    ownerId: string,
    createUploadUrlDto: CreateUploadUrlDto,
  ): Promise<UploadUrlResponse> {
    const folderId = createUploadUrlDto.folderId ?? null;

    if (folderId) {
      await this.getOwnedFolderOrFail(ownerId, folderId);
    }

    const s3Key = this.s3StorageService.createObjectKey(
      ownerId,
      createUploadUrlDto.name,
    );

    const uploadUrl = await this.s3StorageService.createUploadUrl({
      contentType: createUploadUrlDto.mimeType,
      key: s3Key,
    });

    return {
      uploadUrl,
      s3Key,
      method: 'PUT',
      headers: {
        'Content-Type': createUploadUrlDto.mimeType,
      },
    };
  }

  async createMetadataRecord(
    ownerId: string,
    createFileDto: CreateFileDto,
  ): Promise<File> {
    const folderId = createFileDto.folderId ?? null;

    if (folderId) {
      await this.getOwnedFolderOrFail(ownerId, folderId);
    }

    if (!createFileDto.s3Key.startsWith(`users/${ownerId}/`)) {
      throw new ConflictException('The uploaded object key is not valid.');
    }

    const existingFile = await this.filesRepository.findOne({
      where: {
        s3Key: createFileDto.s3Key,
      },
    });

    if (existingFile) {
      throw new ConflictException('This file metadata already exists.');
    }

    const file = this.filesRepository.create({
      name: createFileDto.name,
      s3Key: createFileDto.s3Key,
      size: createFileDto.size,
      mimeType: createFileDto.mimeType,
      folderId,
      ownerId,
    });

    return this.filesRepository.save(file);
  }

  private async getOwnedFolderOrFail(
    ownerId: string,
    folderId: string,
  ): Promise<Folder> {
    const folder = await this.foldersRepository.findOne({
      where: {
        id: folderId,
        ownerId,
      },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found.');
    }

    return folder;
  }
}
