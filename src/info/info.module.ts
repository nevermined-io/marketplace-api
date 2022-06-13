import { Module } from '@nestjs/common';
import { ElasticModule } from '../shared/elasticsearch/elastic.module';
import { InfoController } from './info.controller';

@Module({
  imports: [ElasticModule],
  providers: [],
  controllers: [InfoController],
  exports: [],
})
export class InfoModule {}
