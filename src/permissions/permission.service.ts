import { Injectable } from '@nestjs/common';
import { MarketplaceIndex } from '../common/type';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly elasticService: ElasticService) {}

  async createOne(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = { ...new Permission(), ...createPermissionDto };

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.Permission, permission.id, permission);

    return permission;
  }
}
