import { Injectable } from '@nestjs/common'
import { ElasticService } from '../shared/elasticsearch/elastic.service'
import { CreateAssetDto } from './dto/create-asset.dto'
import { DDOStatus } from './ddo-status.entity'
import { Status, SourceType } from '../common/type'
import { MarketplaceIndex } from '../common/type'
import { SearchHit } from '@elastic/elasticsearch/lib/api/types'
import { StatusMappings } from './ddo-status.mappings'

@Injectable()
export class DDOStatusService {
  constructor(private readonly elasticService: ElasticService) {}

  async createIndex() {
    await this.elasticService.createIndex(MarketplaceIndex.DDOStatus, {
      mappings: StatusMappings,
    })
  }

  async checkIndex(): Promise<boolean> {
    return await this.elasticService.checkExistingIndex(MarketplaceIndex.DDOStatus)
  }

  async createOne(createAssetDto: CreateAssetDto, url: string) {
    const ddoStatus = new DDOStatus()

    ddoStatus.did = createAssetDto.id
    ddoStatus.internal = {
      id: createAssetDto.id,
      type: SourceType.Elasticsearch,
      status: Status.Accepted,
      url: `${url}/${createAssetDto.id}`,
    }
    ddoStatus.external = null

    await this.elasticService.addDocumentToIndex(
      MarketplaceIndex.DDOStatus,
      ddoStatus.did,
      ddoStatus,
    )

    return ddoStatus
  }

  async findOneById(id: string): Promise<SearchHit<DDOStatus>> {
    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.DDOStatus, id) as Promise<
      SearchHit<DDOStatus>
    >
  }
}
