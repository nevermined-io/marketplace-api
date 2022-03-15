import { Injectable } from '@nestjs/common';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './bookmark.entity';

@Injectable()
export class BookmarkService {
    constructor(
        private readonly elasticService: ElasticService
    ) {}

    async createOne(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
        const bookmark = {...new Bookmark(), ...createBookmarkDto};
        
        await this.elasticService.addDocumentToIndex('bookmark', bookmark);

        return bookmark;
    }
}