import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { DDOStatusService } from './ddo-status.service';
import { ElasticModule } from '../shared/elasticsearch/elastic.module';

@Module({
  imports: [ElasticModule],
  providers: [AssetService, DDOStatusService],
  controllers: [AssetController],
  exports: [AssetService, DDOStatusService],
})
export class AssetModule {}
