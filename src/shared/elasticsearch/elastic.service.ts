import { SearchHitsMetadata, QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types'
import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchQueryDto } from '../../common/helpers/search-query.dto'

@Injectable()
export class ElasticService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async addDocumentToIndex(index: string, id: string, document: unknown) {
    return this.elasticsearchService.index({
      index,
      id,
      body: document,
      op_type: 'create',
    })
  }

  async searchByIndex(
    index: string,
    query: QueryDslQueryContainer,
    searchQuery: SearchQueryDto,
    _source_includes?: string | string[],
  ): Promise<SearchHitsMetadata<unknown>> {
    const page = searchQuery?.page ? searchQuery.page - 1 : 0

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
        _source_includes,
      })
    ).hits
  }

  async updateDocumentByIndexAndId(index: string, id: string, document: unknown) {
    return this.elasticsearchService.update({
      index,
      id,
      body: document,
    })
  }

  async getDocumentByIndexAndId(index: string, id: string): Promise<unknown> {
    return await this.elasticsearchService.get({
      index,
      id,
    })
  }

  async deleteDocumentByIndexAndId(index: string, id: string): Promise<unknown> {
    return this.elasticsearchService.delete({
      index,
      id,
    })
  }

  async deleteDocumentByQuery(index: string, query: QueryDslQueryContainer): Promise<unknown> {
    return this.elasticsearchService.deleteByQuery({
      index,
      body: {
        query,
      },
    })
  }

  async createIndex(index: string, body: unknown): Promise<void> {
    await this.elasticsearchService.indices.create({
      index,
      body,
    })
  }

  async checkExistingIndex(index: string) {
    return this.elasticsearchService.indices.exists({
      index,
    })
  }

  async getInfo() {
    return this.elasticsearchService.info()
  }
}
