import { Injectable } from '@nestjs/common';
import { SearchHit, SearchHitsMetadata } from '@elastic/elasticsearch/api/types';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { Bookmark } from './bookmark.entity';
import { MarketplaceIndex } from '../common/type';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { BookmarkMappings } from './bookmark.mappings';

@Injectable()
export class BookmarkService {
  constructor(private readonly elasticService: ElasticService) {}

  async createIndex() {
    await this.elasticService.createIndex(MarketplaceIndex.Bookmark, {
      mappings: BookmarkMappings,
    });
  }

  async checkIndex(): Promise<boolean> {
    return (await this.elasticService.checkExistingIndex(MarketplaceIndex.Bookmark)).body;
  }

  async createOne(createBookmarkDto: CreateBookmarkDto): Promise<Bookmark> {
    const bookmark = { ...new Bookmark(), ...createBookmarkDto };

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.Bookmark, bookmark.id, bookmark);

    return bookmark;
  }

  async findOneById(id: string): Promise<SearchHit<Bookmark>> {
    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.Bookmark, id) as Promise<SearchHit<Bookmark>>;
  }

  async findManyByUserId(userId: string, searchQueryDto: SearchQueryDto): Promise<SearchHitsMetadata<Bookmark>> {
    return this.elasticService.searchByIndex(
      MarketplaceIndex.Bookmark,
      {
        term: {
          userId: {
            value: userId,
          },
        },
      },
      searchQueryDto
    ) as Promise<SearchHitsMetadata<Bookmark>>;
  }

  async updateOneByEntryId(entryId: string, updateBookmarkDto: UpdateBookmarkDto): Promise<SearchHit<Bookmark>> {
    await this.elasticService.updateDocumentByIndexAndId(MarketplaceIndex.Bookmark, entryId, {
      doc: updateBookmarkDto,
    });

    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.Bookmark, entryId) as Promise<
      SearchHit<Bookmark>
    >;
  }

  async deleteOneByEntryId(entryId: string): Promise<void> {
    await this.elasticService.deleteDocumentByIndexAndId(MarketplaceIndex.Bookmark, entryId);
  }
}
