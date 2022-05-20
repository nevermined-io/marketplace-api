import { Injectable } from '@nestjs/common';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './asset.entity';
import { MarketplaceIndex } from '../common/type';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchHitsMetadata, SearchHit } from '@elastic/elasticsearch/api/types';
import { AssetMappings } from './asset.mappings';

@Injectable()
export class AssetService {
  constructor(private readonly elasticService: ElasticService) {}

  async createIndex() {
    await this.elasticService.createIndex(MarketplaceIndex.Asset, {
      mappings: AssetMappings,
    });
  }

  async checkIndex(): Promise<boolean> {
    return (await this.elasticService.checkExistingIndex(MarketplaceIndex.Asset)).body;
  }

  async createOne(createAssetDto: CreateAssetDto): Promise<Asset> {
    const asset = { ...new Asset(), ...createAssetDto };

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.Asset, asset.id, asset);

    return asset;
  }

  async findManyIds(searchQueryDto: SearchQueryDto): Promise<string[]> {
    return (
      await this.elasticService.searchByIndex(MarketplaceIndex.Asset, searchQueryDto.query, searchQueryDto, 'id')
    ).hits.map((asset) => (asset._source as Asset).id);
  }

  async findMany(searchQueryDto: SearchQueryDto): Promise<SearchHitsMetadata<Asset>> {
    return this.elasticService.searchByIndex(
      MarketplaceIndex.Asset,
      {
        match_all: {},
      },
      searchQueryDto
    ) as Promise<SearchHitsMetadata<Asset>>;
  }

  async findOneById(id: string): Promise<SearchHit<Asset>> {
    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.Asset, id) as Promise<SearchHit<Asset>>;
  }

  async updateOneByEntryId(entryId: string, updateAssetDto: UpdateAssetDto): Promise<SearchHit<Asset>> {
    await this.elasticService.updateDocumentByIndexAndId(MarketplaceIndex.Asset, entryId, {
      doc: updateAssetDto,
    });

    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.Asset, entryId) as Promise<SearchHit<Asset>>;
  }

  async deleteAll(): Promise<void> {
    await this.elasticService.deleteDocumentByQuery(MarketplaceIndex.Asset, {
      match_all: {},
    });
  }

  async deleteOneByEntryId(entryId: string): Promise<void> {
    await this.elasticService.deleteDocumentByIndexAndId(MarketplaceIndex.Asset, entryId);
  }
}
