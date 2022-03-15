import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { ElasticModule } from '../shared/elasticsearch/elastic.module';

@Module({
    imports: [ElasticModule],
    providers: [BookmarkService],
    controllers: [BookmarkController],
    exports: [BookmarkService],
})
export class BookmarkModule {}