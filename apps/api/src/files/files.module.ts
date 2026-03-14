import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from '../folders/entities/folder.entity';
import { UsersModule } from '../users/users.module';
import { FileAccess } from './entities/file-access.entity';
import { File } from './entities/file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { S3StorageService } from './s3-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([File, FileAccess, Folder]), UsersModule],
  controllers: [FilesController],
  providers: [FilesService, S3StorageService],
})
export class FilesModule {}
