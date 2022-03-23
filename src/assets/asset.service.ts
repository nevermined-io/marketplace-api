import { Injectable } from '@nestjs/common';
import { SearchHit } from '@elastic/elasticsearch/api/types';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from './asset.entity';
import { MarketplaceIndex } from '../common/type';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { ConfigService } from '../shared/config/config.service';

@Injectable()
export class AssetService {
    indexDB: string;

    constructor(
        private readonly elasticService: ElasticService,
        private readonly configService: ConfigService
    ) {
        this.indexDB = configService.get<string>('assetIndex') || MarketplaceIndex.asset;
    }

    async createOne(createAssetDto: CreateAssetDto): Promise<Asset> {
        const asset = {...new Asset(), ...createAssetDto};

        await this.elasticService.addDocumentToIndex(this.indexDB, asset.id, asset);

        return asset;
    }
}