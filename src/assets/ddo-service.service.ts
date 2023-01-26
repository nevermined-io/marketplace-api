import { Injectable } from '@nestjs/common'
import { ElasticService } from '../shared/elasticsearch/elastic.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { Service } from './ddo-service.entity'
import { MarketplaceIndex } from '../common/type'
import { SearchHit, SearchHitsMetadata } from '@elastic/elasticsearch/api/types'
import { SearchQueryDto } from '../common/helpers/search-query.dto'
import { ServiceMappings } from './ddo-service.mappings'

@Injectable()
export class ServiceDDOService {
  constructor(private readonly elasticService: ElasticService) {}

  async createIndex() {
    await this.elasticService.createIndex(MarketplaceIndex.Service, {
      mappings: ServiceMappings,
    })
  }

  async checkIndex(): Promise<boolean> {
    return (await this.elasticService.checkExistingIndex(MarketplaceIndex.Service)).body
  }

  async createOne(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = { ...new Service(), ...createServiceDto }

    await this.elasticService.addDocumentToIndex(
      MarketplaceIndex.Service,
      service.agreementId,
      service,
    )

    return service
  }

  async findOneById(id: string): Promise<SearchHit<Service>> {
    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.Service, id) as Promise<
      SearchHit<Service>
    >
  }

  async findMany(searchQueryDto: SearchQueryDto): Promise<SearchHitsMetadata<Service>> {
    return this.elasticService.searchByIndex(
      MarketplaceIndex.Service,
      searchQueryDto.query,
      searchQueryDto,
    ) as Promise<SearchHitsMetadata<Service>>
  }

  async deleteAll(): Promise<void> {
    await this.elasticService.deleteDocumentByQuery(MarketplaceIndex.Service, {
      match_all: {},
    })
  }
}
