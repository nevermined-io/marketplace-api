import { Injectable } from '@nestjs/common';
import { MarketplaceIndex, PermissionType } from '../common/type';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { SearchHit, SearchHitsMetadata } from '@elastic/elasticsearch/api/types';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

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

  async findManyByUserIdAndType(
    userId: string,
    type: PermissionType,
    searchQueryDto: SearchQueryDto
  ): Promise<SearchHitsMetadata<Permission>> {
    return this.elasticService.searchByIndex(
      MarketplaceIndex.Permission,
      {
        bool: {
          must: {
            term: {
              'userId.keyword': {
                value: userId,
              },
            },
          },
          ...(type
            ? {
                filter: {
                  match: {
                    type,
                  },
                },
              }
            : undefined),
        },
      },
      searchQueryDto
    ) as Promise<SearchHitsMetadata<Permission>>;
  }

  async updateOneByEntryId(entryId: string, updatePermissionDto: UpdatePermissionDto): Promise<SearchHit<Permission>> {
    await this.elasticService.updateDocumentByIndexAndId(MarketplaceIndex.Permission, entryId, {
      doc: updatePermissionDto,
    });

    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.Permission, entryId) as Promise<
      SearchHit<Permission>
    >;
  }

  async deleteOneByEntryId(entryId: string): Promise<void> {
    await this.elasticService.deleteDocumentByIndexAndId(MarketplaceIndex.Permission, entryId);
  }
}
