import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ElasticService } from './elastic.service'
import { ConfigService } from '../config/config.service'
import { ConfigModule } from '../config/config.module'
import { Logger } from '@nevermined-io/sdk'

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const node = configService.get<string>('elasticsearch.node')
        const cloudId = configService.get<string>('elasticsearch.cloudId')
        Logger.log('Connecting elasticsearch...')
        if (cloudId && cloudId !== '') {
          Logger.log('Connecting using cloudId and apiKey.')
          const apiKey = configService.get<string>('elasticsearch.auth.apiKey')
          return {
            cloud: { id: cloudId },
            auth: {
              apiKey,
            },
          }
        } else {
          Logger.log('Connecting using user/pass')
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
