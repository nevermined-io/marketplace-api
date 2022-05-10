import { ApiResponse } from '@elastic/elasticsearch';
import { SearchHitsMetadata, QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchQueryDto } from '../../common/helpers/search-query.dto';

@Injectable()
export class ElasticService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async addDocumentToIndex(index: string, id: string, document: unknown) {
    return this.elasticsearchService.index({
      index,
      id,
      body: document,
    });
  }

  async searchByIndex(
    index: string,
    query: QueryDslQueryContainer,
    searchQuery: SearchQueryDto,
    _source_includes?: string | string[]
  ): Promise<SearchHitsMetadata<unknown>> {
    const page = searchQuery?.page - 1;

    /* eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
    return (
      await this.elasticsearchService.search({
        index,
        size: searchQuery?.offset,
        from: searchQuery?.offset ? searchQuery.offset * page : undefined,
        body: {
          sort: searchQuery?.sort,
          query: query || {
            match_all: {},
          },
        },
        q: searchQuery?.text,
        _source_includes,
      })
    ).body.hits;
  }

  async updateDocumentByIndexAndId(index: string, id: string, document: unknown) {
    return this.elasticsearchService.update({
      index,
      id,
      body: document,
    });
  }

  async getDocumentByIndexAndId(index: string, id: string): Promise<unknown> {
    return (
      await this.elasticsearchService.get({
        index,
        id,
      })
    ).body;
  }

  async deleteDocumentByIndexAndId(index: string, id: string): Promise<unknown> {
    return this.elasticsearchService.delete({
      index,
      id,
    });
  }

  async deleteDocumentByQuery(index: string, query: QueryDslQueryContainer): Promise<unknown> {
    return this.elasticsearchService.deleteByQuery({
      index,
      body: {
        query,
      },
    });
  }

  async createIndex(index: string): Promise<void> {
    await this.elasticsearchService.indices.create({
      index,
    });
  }

  async checkExistingIndex(index: string): Promise<ApiResponse<boolean, unknown>> {
    return this.elasticsearchService.indices.exists({
      index,
    });
  }
}
