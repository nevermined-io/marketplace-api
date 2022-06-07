import { SearchQueryDto } from './search-query.dto';
import { SearchResults } from './search-query.interface';
import { SearchHitsMetadata } from '@elastic/elasticsearch/api/types';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class SearchResponse<G> {
  static fromSearchSources<Dto>(
    searchQueryDto: SearchQueryDto,
    hits: SearchHitsMetadata<unknown>,
    dto: Dto
  ): SearchResponse<Dto> {
    return {
      page: searchQueryDto.page,
      results: dto,
      total_pages: Math.ceil((hits.total as SearchResults).value / searchQueryDto.offset),
      total_results: hits.total as SearchResults,
    };
  }

  static toDocs<Dto>(dto: unknown): SchemaObject {
    return {
      properties: {
        page: {
          type: 'number',
          example: 1,
        },
        results: {
          type: 'array',
          items: {
            $ref: getSchemaPath(dto as () => Dto),
          },
        },
        total_pages: {
          type: 'number',
          example: 10,
        },
        total_results: {
          type: 'object',
          example: { value: 220, relation: 'eq' },
        },
      },
    };
  }

  @ApiProperty({
    example: 1,
    description: 'Number of page',
  })
  page: number;
  @ApiProperty({
    example: ['did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430'],
    description: 'Number of page',
  })
  results: G;

  @ApiProperty({
    example: 10,
    description: 'total of pages',
  })
  total_pages: number;

  @ApiProperty({
    example: { value: 1, relation: 'eq' },
    description: 'total of the entries found and relation used',
  })
  total_results: SearchResults;

  constructor(page: number, results: G, total_pages: number, total_results: SearchResults) {
    this.page = page;
    this.results = results;
    this.total_pages = total_pages;
    this.total_results = total_results;
  }
}
