import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { RealtimeService } from '../realtime/realtime.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import { Folder } from './entities/folder.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private readonly foldersRepository: Repository<Folder>,
    private readonly realtimeService: RealtimeService,
  ) {}

  async create(ownerId: string, createFolderDto: CreateFolderDto): Promise<Folder> {
    const parentId = createFolderDto.parentId ?? null;

    if (parentId) {
      await this.getOwnedFolderOrFail(ownerId, parentId);
    }

    const folder = this.foldersRepository.create({
      name: createFolderDto.name,
      ownerId,
      parentId,
    });

    const savedFolder = await this.foldersRepository.save(folder);

    this.realtimeService.emitFilesUpdatedToUsers([ownerId]);

    return savedFolder;
  }

  findAllForOwner(ownerId: string): Promise<Folder[]> {
    return this.foldersRepository.find({
      where: { ownerId },
      order: { createdAt: 'ASC' },
    });
  }

  searchForOwner(ownerId: string, query: string): Promise<Folder[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return Promise.resolve([]);
    }

    return this.foldersRepository.find({
      where: {
        ownerId,
        name: ILike(`%${normalizedQuery}%`),
      },
      order: {
        name: 'ASC',
      },
      take: 10,
    });
  }

  async rename(
    ownerId: string,
    folderId: string,
    updateFolderDto: UpdateFolderDto,
  ): Promise<Folder> {
    const folder = await this.getOwnedFolderOrFail(ownerId, folderId);

    folder.name = updateFolderDto.name;

    const savedFolder = await this.foldersRepository.save(folder);

    this.realtimeService.emitFilesUpdatedToUsers([ownerId]);

    return savedFolder;
  }

  async remove(ownerId: string, folderId: string): Promise<void> {
    await this.getOwnedFolderOrFail(ownerId, folderId);

    await this.foldersRepository.delete({
      id: folderId,
      ownerId,
    });

    this.realtimeService.emitFilesUpdatedToUsers([ownerId]);
  }

  private async getOwnedFolderOrFail(
    ownerId: string,
    folderId: string,
  ): Promise<Folder> {
    const folder = await this.foldersRepository.findOne({
      where: { id: folderId, ownerId },
    });

    if (!folder) {
      throw new NotFoundException('Folder not found.');
    }

    return folder;
  }
}
