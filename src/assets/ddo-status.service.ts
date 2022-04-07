import { PATH_METADATA } from '@nestjs/common/constants';
import { Injectable } from '@nestjs/common';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { DDOStatus } from './ddo-status.entity';
import { Status, SourceType } from '../common/type';
import { MarketplaceIndex } from '../common/type';
import { AssetController } from './asset.controller';
import { Logger } from '../shared/logger/logger.service';

@Injectable()
export class DDOStatusService {
  constructor(private readonly elasticService: ElasticService) {}
  async createOne(createAssetDto: CreateAssetDto, url: string) {
    const ddoStatus = new DDOStatus();

    ddoStatus.did = createAssetDto.id;
    ddoStatus.internal = {
      id: createAssetDto.id,
      type: SourceType.Elasticsearch,
      status: Status.Accepted,
      url,
    };
    ddoStatus.external = null;

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.DDOStatus, ddoStatus.did, ddoStatus);

    return ddoStatus;
  }
}
