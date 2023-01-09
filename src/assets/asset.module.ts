import { Module } from '@nestjs/common'
import { AssetController } from './asset.controller'
import { AssetService } from './asset.service'
import { DDOStatusService } from './ddo-status.service'
import { ServiceDDOService } from './ddo-service.service'
import { ElasticModule } from '../shared/elasticsearch/elastic.module'

@Module({
  imports: [ElasticModule],
  providers: [AssetService, DDOStatusService, ServiceDDOService],
  controllers: [AssetController],
  exports: [AssetService, DDOStatusService, ServiceDDOService],
})
export class AssetModule {}
