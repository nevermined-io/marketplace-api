import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ElasticService } from './elastic.service'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const username = configService.get<string>('elasticsearch.auth.username')
        const password = configService.get<string>('elasticsearch.auth.password')
        const node = configService.get<string>('elasticsearch.node')

        return {
          node,
          auth: {
            username,
            password,
          },
        }
      },
    }),
  ],
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticModule {}
