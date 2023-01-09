import { Module } from '@nestjs/common'
import { UserProfileController } from './user-profile.controller'
import { UserProfileService } from './user-profile.service'
import { ElasticModule } from '../shared/elasticsearch/elastic.module'

@Module({
  imports: [ElasticModule],
  providers: [UserProfileService],
  controllers: [UserProfileController],
  exports: [UserProfileService],
})
export class UserProfileModule {}
