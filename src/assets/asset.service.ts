import { Injectable } from '@nestjs/common';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from './asset.entity';
import { MarketplaceIndex } from '../common/type';

@Injectable()
export class AssetService {
  indexDB: string;

  constructor(private readonly elasticService: ElasticService) {}

  async createOne(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = { ...new Asset(), ...createAssetDto };

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.asset, asset.id, asset);

    return asset;
  }
}
