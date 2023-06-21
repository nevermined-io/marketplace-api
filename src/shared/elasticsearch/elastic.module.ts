import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ElasticService } from './elastic.service'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const node = configService.get<string>('elasticsearch.node')
        const cloudId = configService.get<string>('elasticsearch.cloudId')
        if (cloudId) {
          const apiKey = configService.get<string>('elasticsearch.auth.apiKey')
          return {
            cloud: { id: cloudId },
            auth: {
              apiKey,
            },
          }
        } else {
          const username = configService.get<string>('elasticsearch.auth.username')
          const password = configService.get<string>('elasticsearch.auth.password')
          return {
            node,
            auth: {
              username,
              password,
            },
          }
        }
      },
    }),
  ],
  providers: [ElasticService],
  exports: [ElasticService],
})
export class ElasticModule {}
