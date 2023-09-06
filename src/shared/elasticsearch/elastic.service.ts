import {
  SearchHitsMetadata,
  QueryDslQueryContainer,
  IndicesExistsResponse,
} from '@elastic/elasticsearch/lib/api/types'
import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchQueryDto } from '../../common/helpers/search-query.dto'
import { ConfigService } from '../config/config.service'

@Injectable()
export class ElasticService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async addDocumentToIndex(
    index: string,
    id: string,
    document: unknown,
    refresh?: boolean | 'wait_for',
  ) {
    return this.elasticsearchService.index({
      index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
      id,
      body: document,
      op_type: 'create',
      refresh,
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
        index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
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

  async updateDocumentByIndexAndId(
    index: string,
    id: string,
    document: unknown,
    refresh?: boolean | 'wait_for',
  ) {
    return this.elasticsearchService.update({
      index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
      id,
      body: document,
      refresh,
    })
  }

  async getDocumentByIndexAndId(index: string, id: string, refresh?: boolean): Promise<unknown> {
    return await this.elasticsearchService.get({
      index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
      id,
      refresh,
    })
  }

  async deleteDocumentByIndexAndId(
    index: string,
    id: string,
    refresh?: boolean | 'wait_for',
  ): Promise<unknown> {
    return this.elasticsearchService.delete({
      index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
      id,
      refresh,
    })
  }

  async deleteDocumentByQuery(
    index: string,
    query: QueryDslQueryContainer,
    refresh?: boolean,
  ): Promise<unknown> {
    return this.elasticsearchService.deleteByQuery({
      index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
      body: {
        query,
      },
      refresh,
    })
  }

  async createIndex(index: string, body: unknown): Promise<void> {
    await this.elasticsearchService.indices.create({
      index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
      body,
    })
  }

  async checkExistingIndex(index: string): Promise<IndicesExistsResponse> {
    return this.elasticsearchService.indices.exists({
      index: `${this.configService.get<string>('elasticsearch.prefix')}-${index}`,
    })
  }

  async getInfo() {
    return this.elasticsearchService.info()
  }
}
