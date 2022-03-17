import { SearchHit, QueryDslQueryContainer } from '@elastic/elasticsearch/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {}
  
  async addDocumentToIndex(index: string, document: unknown) {
    return this.elasticsearchService.index({
      index,
      body: document,
    });
  }

  async searchByIndex(index: string, query: QueryDslQueryContainer): Promise<SearchHit<unknown>[]> {
    /* eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
    return (await this.elasticsearchService.search({
      index,
      body: {
        query,
      },
    })).body.hits.hits;
  }

  async updateDocumentByIndexAndId(index: string, id: string, document: unknown) {
    return this.elasticsearchService.update({
      index,
      id,
      body: document,
    });
  }

  async getDocumentByIndexAndId(index: string, id: string): Promise<unknown> {
    return (await this.elasticsearchService.get({
      index,
      id,
    })).body;
  }

  async deleteDocumentByIndexAndId(index: string, id: string): Promise<unknown> {
    return this.elasticsearchService.delete({
      index,
      id,
    });
  }
}