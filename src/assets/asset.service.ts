import { Injectable } from '@nestjs/common';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Asset } from './asset.entity';
import { MarketplaceIndex } from '../common/type';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchHit } from '@elastic/elasticsearch/api/types';

@Injectable()
export class AssetService {
  indexDB: string;

  constructor(private readonly elasticService: ElasticService) {}

  async createOne(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = { ...new Asset(), ...createAssetDto };

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.Asset, asset.id, asset);

    return asset;
  }

  async findAllIds(searchQueryDto: SearchQueryDto): Promise<string[]> {
    return (
      await this.elasticService.searchByIndex(
        MarketplaceIndex.Asset,
        {
          match_all: {},
        },
        searchQueryDto,
        'id'
      )
    ).map((asset) => (asset._source as Asset).id);
  }

  async findAll(searchQueryDto: SearchQueryDto): Promise<SearchHit<Asset>[]> {
    return this.elasticService.searchByIndex(
      MarketplaceIndex.Asset,
      {
        match_all: {},
      },
      searchQueryDto
    ) as Promise<SearchHit<Asset>[]>;
  }

  async deleteAll() {
    await this.elasticService.deleteDocumentByQuery(MarketplaceIndex.Asset, {
      match_all: {},
    });
  }
}
