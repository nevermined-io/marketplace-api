import { QueryDslQueryContainer, SearchHit, SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {}
  
  async addDocumentToIndex(index, document: unknown) {
    await this.elasticsearchService.index({
      index: index,
      document: document
    });
  }

  async searchByIndex(index: string, query: QueryDslQueryContainer): Promise<SearchHit<unknown>[]> {
    return (await this.elasticsearchService.search({
      index,
      query,
    })).hits.hits;
  }
}