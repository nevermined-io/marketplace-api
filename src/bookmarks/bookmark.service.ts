import { Injectable } from '@nestjs/common';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './bookmark.entity';
import { MarketplaceIndex } from '../common/type';

@Injectable()
export class BookmarkService {
    constructor(
        private readonly elasticService: ElasticService
    ) {}

    async createOne(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
        const bookmark = {...new Bookmark(), ...createBookmarkDto};
        
        await this.elasticService.addDocumentToIndex(MarketplaceIndex.Bookmark, bookmark);

        return bookmark;
    }

    async findOne(id: string): Promise<Bookmark> {
        return (await this.elasticService.searchByIndex(MarketplaceIndex.Bookmark, {
            term: {
                'id.keyword': {
                    value: id
                },
            }
        }))?.[0]?._source as Bookmark;
    }
}