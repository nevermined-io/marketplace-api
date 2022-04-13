import { Injectable } from '@nestjs/common';
import { MarketplaceIndex } from '../common/type';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { UserProfile } from './user-profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly elasticService: ElasticService) {}

  async createOne(createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    const userProfile = { ...new UserProfile(), ...createUserProfileDto };

    await this.elasticService.addDocumentToIndex(MarketplaceIndex.UserProfile, userProfile.userId, userProfile);

    return userProfile;
  }
}
