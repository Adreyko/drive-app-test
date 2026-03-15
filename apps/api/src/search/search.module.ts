import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module';
import { FoldersModule } from '../folders/folders.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [FilesModule, FoldersModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
