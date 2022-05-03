import { Injectable } from '@nestjs/common';
import { MarketplaceIndex } from '../common/type';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { SearchHit, SearchHitsMetadata } from '@elastic/elasticsearch/api/types';
import { SearchQueryDto } from '../common/helpers/search-query.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly elasticService: ElasticService) {}

  async createOne(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = { ...new Permission(), ...createPermissionDto };

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.Permission, permission.id, permission);

    return permission;
  }

  async findOneById(id: string): Promise<SearchHit<Permission>> {
    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.Permission, id) as Promise<
      SearchHit<Permission>
    >;
  }

  async findManyByUserId(userId: string, searchQueryDto: SearchQueryDto): Promise<SearchHitsMetadata<Permission>> {
    return this.elasticService.searchByIndex(
      MarketplaceIndex.Permission,
      {
        term: {
          'userId.keyword': {
            value: userId,
          },
        },
      },
      searchQueryDto
    ) as Promise<SearchHitsMetadata<Permission>>;
  }
}
