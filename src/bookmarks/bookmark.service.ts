import { Injectable } from '@nestjs/common';
import { SearchHit } from '@elastic/elasticsearch/api/types';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
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

    async findManyById(id: string): Promise<SearchHit<Bookmark>[]> {
        return this.elasticService.searchByIndex(MarketplaceIndex.Bookmark, {
            term: {
                'id.keyword': {
                    value: id
                },
            }
        }) as Promise<SearchHit<Bookmark>[]>;
    }

    async findManyByUserId(userId: string): Promise<SearchHit<Bookmark>[]> {
        return this.elasticService.searchByIndex(MarketplaceIndex.Bookmark, {
            term: {
                'userId.keyword': {
                    value: userId
                },
            }
        }) as Promise<SearchHit<Bookmark>[]>;
    }

    async updateOneByEntryId(entryId: string, updateBookmarkDto: UpdateBookmarkDto): Promise<SearchHit<Bookmark>> {
        await this.elasticService.updateDocumentByIndexAndId(MarketplaceIndex.Bookmark, entryId, {
            doc: updateBookmarkDto
        });

        return this.elasticService
            .getDocumentByIndexAndId(MarketplaceIndex.Bookmark, entryId) as Promise<SearchHit<Bookmark>>;
    }
}