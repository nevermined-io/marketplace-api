import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { ElasticModule } from '../shared/elasticsearch/elastic.module';
import { ConfigModule } from '../shared/config/config.module';

@Module({
    imports: [ElasticModule, ConfigModule],
    providers: [AssetService],
    controllers: [AssetController],
    exports: [AssetService],
})
export class AssetModule {}