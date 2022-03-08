import { Module } from '@nestjs/common';
import {GreetingController} from './greeting.controller';
import { GreetingService } from './greeting.service';
import {ElasticModule} from '../shared/elasticsearch/elastic.module';

@Module({
    imports: [ElasticModule],
    providers: [GreetingService],
    controllers: [GreetingController],
    exports: [GreetingService],
})
export class GreetingModule {}