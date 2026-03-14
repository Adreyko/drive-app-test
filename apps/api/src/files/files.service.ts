import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { type DownloadUrlResponse } from './interfaces/download-url-response.interface';
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

    const storedObjectSize = await this.s3StorageService.getStoredObjectSize(
      createFileDto.s3Key,
    );

    if (storedObjectSize === null) {
      throw new UnprocessableEntityException(
        'The uploaded file was not found in storage.',
      );
    }

    if (storedObjectSize !== createFileDto.size) {
      throw new UnprocessableEntityException(
        'The uploaded file size does not match the stored object.',
      );
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

  async update(
    ownerId: string,
    fileId: string,
    updateFileDto: UpdateFileDto,
  ): Promise<File> {
    const file = await this.getOwnedFileOrFail(ownerId, fileId);
    const hasNameUpdate = updateFileDto.name !== undefined;
    const hasFolderUpdate = updateFileDto.folderId !== undefined;

    if (!hasNameUpdate && !hasFolderUpdate) {
      throw new BadRequestException(
        'Provide at least one file field to update.',
      );
    }

    if (hasNameUpdate) {
      file.name = updateFileDto.name!;
    }

    if (hasFolderUpdate) {
      const nextFolderId = updateFileDto.folderId ?? null;

      if (nextFolderId) {
        await this.getOwnedFolderOrFail(ownerId, nextFolderId);
      }

      file.folderId = nextFolderId;
    }

    return this.filesRepository.save(file);
  }

  async remove(ownerId: string, fileId: string): Promise<void> {
    const file = await this.getOwnedFileOrFail(ownerId, fileId);

    await this.s3StorageService.removeObject(file.s3Key);
    await this.filesRepository.delete({
      id: file.id,
      ownerId,
    });
  }

  async createDownloadUrl(
    ownerId: string,
    fileId: string,
  ): Promise<DownloadUrlResponse> {
    const file = await this.getOwnedFileOrFail(ownerId, fileId);
    const storedObjectSize = await this.s3StorageService.getStoredObjectSize(
      file.s3Key,
    );

    if (storedObjectSize === null) {
      throw new NotFoundException('Stored file not found.');
    }

    return {
      downloadUrl: await this.s3StorageService.createDownloadUrl(file.s3Key),
      method: 'GET',
    };
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

  private async getOwnedFileOrFail(
    ownerId: string,
    fileId: string,
  ): Promise<File> {
    const file = await this.filesRepository.findOne({
      where: {
        id: fileId,
        ownerId,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found.');
    }

    return file;
  }
}
