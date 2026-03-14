import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { UsersService } from '../users/users.service';
import { CreateFileDto } from './dto/create-file.dto';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { ShareFileDto } from './dto/share-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { type ResolvedFileAccessRole, FileAccessRole } from './enums/file-access-role.enum';
import { FileVisibility } from './enums/file-visibility.enum';
import { FileAccess } from './entities/file-access.entity';
import { File } from './entities/file.entity';
import { toFileListItem } from './files.mapper';
import { type DownloadUrlResponse } from './interfaces/download-url-response.interface';
import { type FileListItem } from './interfaces/file-list-item.interface';
import { type ShareFileResponse } from './interfaces/share-file-response.interface';
import { type UploadUrlResponse } from './interfaces/upload-url-response.interface';
import { S3StorageService } from './s3-storage.service';

type AccessibleFile = {
  file: File;
  accessRole: ResolvedFileAccessRole;
};

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
    @InjectRepository(FileAccess)
    private readonly fileAccessRepository: Repository<FileAccess>,
    @InjectRepository(Folder)
    private readonly foldersRepository: Repository<Folder>,
    private readonly s3StorageService: S3StorageService,
    private readonly usersService: UsersService,
  ) {}

  async findAllVisibleForUser(userId: string): Promise<FileListItem[]> {
    const [ownedFiles, sharedAccesses, publicFiles] = await Promise.all([
      this.filesRepository.find({
        where: { ownerId: userId },
        relations: {
          owner: true,
        },
        order: {
          updatedAt: 'DESC',
        },
      }),
      this.fileAccessRepository.find({
        where: { userId },
        relations: {
          file: {
            owner: true,
          },
        },
        order: {
          createdAt: 'DESC',
        },
      }),
      this.filesRepository.find({
        where: {
          ownerId: Not(userId),
          visibility: FileVisibility.PUBLIC,
        },
        relations: {
          owner: true,
        },
        order: {
          updatedAt: 'DESC',
        },
      }),
    ]);

    const itemsByFileId = new Map<string, FileListItem>();

    for (const file of publicFiles) {
      itemsByFileId.set(file.id, toFileListItem(file, FileAccessRole.VIEWER));
    }

    for (const access of sharedAccesses) {
      itemsByFileId.set(access.file.id, toFileListItem(access.file, access.role));
    }

    for (const file of ownedFiles) {
      itemsByFileId.set(file.id, toFileListItem(file, 'owner'));
    }

    return [...itemsByFileId.values()].sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    );
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
  ): Promise<FileListItem> {
    const folderId = createFileDto.folderId ?? null;
    const visibility = createFileDto.visibility ?? FileVisibility.PRIVATE;

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
      visibility,
      folderId,
      ownerId,
    });

    await this.filesRepository.save(file);

    return this.buildOwnedFileItem(ownerId, file.id);
  }

  async update(
    userId: string,
    fileId: string,
    updateFileDto: UpdateFileDto,
  ): Promise<FileListItem> {
    const { file, accessRole } = await this.getAccessibleFileOrFail(userId, fileId);
    const hasNameUpdate = updateFileDto.name !== undefined;
    const hasFolderUpdate = updateFileDto.folderId !== undefined;
    const hasVisibilityUpdate = updateFileDto.visibility !== undefined;

    if (!hasNameUpdate && !hasFolderUpdate && !hasVisibilityUpdate) {
      throw new BadRequestException(
        'Provide at least one file field to update.',
      );
    }

    if (hasNameUpdate) {
      this.assertCanRename(accessRole);
      file.name = updateFileDto.name!;
    }

    if (hasFolderUpdate) {
      this.assertCanMove(accessRole);
      const nextFolderId = updateFileDto.folderId ?? null;

      if (nextFolderId) {
        await this.getOwnedFolderOrFail(file.ownerId, nextFolderId);
      }

      file.folderId = nextFolderId;
    }

    if (hasVisibilityUpdate) {
      this.assertCanChangeVisibility(accessRole);
      file.visibility = updateFileDto.visibility!;
    }

    await this.filesRepository.save(file);

    return this.buildAccessibleFileItem(userId, file.id);
  }

  async remove(userId: string, fileId: string): Promise<void> {
    const { file, accessRole } = await this.getAccessibleFileOrFail(userId, fileId);

    this.assertIsOwner(accessRole);

    await this.s3StorageService.removeObject(file.s3Key);
    await this.filesRepository.delete({
      id: file.id,
      ownerId: file.ownerId,
    });
  }

  async createDownloadUrl(
    userId: string,
    fileId: string,
  ): Promise<DownloadUrlResponse> {
    const { file } = await this.getAccessibleFileOrFail(userId, fileId);
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

  async share(
    userId: string,
    fileId: string,
    shareFileDto: ShareFileDto,
  ): Promise<ShareFileResponse> {
    const file = await this.getOwnedFileOrFail(userId, fileId);
    const recipient = await this.usersService.findByEmail(shareFileDto.email);

    if (!recipient) {
      throw new NotFoundException('Recipient user not found.');
    }

    if (recipient.id === file.ownerId) {
      throw new BadRequestException('You already own this file.');
    }

    const existingAccess = await this.fileAccessRepository.findOne({
      where: {
        fileId: file.id,
        userId: recipient.id,
      },
    });

    const access = existingAccess ?? this.fileAccessRepository.create({
      fileId: file.id,
      userId: recipient.id,
    });

    access.role = shareFileDto.role;

    const savedAccess = await this.fileAccessRepository.save(access);

    return {
      fileId: file.id,
      userId: recipient.id,
      email: recipient.email,
      role: savedAccess.role,
      createdAt: savedAccess.createdAt,
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
      relations: {
        owner: true,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found.');
    }

    return file;
  }

  private async getAccessibleFileOrFail(
    userId: string,
    fileId: string,
  ): Promise<AccessibleFile> {
    const file = await this.filesRepository.findOne({
      where: {
        id: fileId,
      },
      relations: {
        owner: true,
      },
    });

    if (!file) {
      throw new NotFoundException('File not found.');
    }

    if (file.ownerId === userId) {
      return {
        file,
        accessRole: 'owner',
      };
    }

    const access = await this.fileAccessRepository.findOne({
      where: {
        fileId: file.id,
        userId,
      },
    });

    if (!access) {
      if (file.visibility === FileVisibility.PUBLIC) {
        return {
          file,
          accessRole: FileAccessRole.VIEWER,
        };
      }

      throw new NotFoundException('File not found.');
    }

    return {
      file,
      accessRole: access.role,
    };
  }

  private async buildOwnedFileItem(
    ownerId: string,
    fileId: string,
  ): Promise<FileListItem> {
    return this.buildAccessibleFileItem(ownerId, fileId);
  }

  private async buildAccessibleFileItem(
    userId: string,
    fileId: string,
  ): Promise<FileListItem> {
    const { file, accessRole } = await this.getAccessibleFileOrFail(userId, fileId);

    return toFileListItem(file, accessRole);
  }

  private assertIsOwner(accessRole: ResolvedFileAccessRole): void {
    if (accessRole !== 'owner') {
      throw new ForbiddenException('Only the file owner can perform this action.');
    }
  }

  private assertCanRename(accessRole: ResolvedFileAccessRole): void {
    if (accessRole === FileAccessRole.VIEWER) {
      throw new ForbiddenException('You do not have permission to rename this file.');
    }
  }

  private assertCanMove(accessRole: ResolvedFileAccessRole): void {
    if (accessRole !== 'owner') {
      throw new ForbiddenException('Only the file owner can move this file.');
    }
  }

  private assertCanChangeVisibility(accessRole: ResolvedFileAccessRole): void {
    if (accessRole !== 'owner') {
      throw new ForbiddenException(
        'Only the file owner can change file visibility.',
      );
    }
  }
}
