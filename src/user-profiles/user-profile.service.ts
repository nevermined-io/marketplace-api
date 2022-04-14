import { Injectable } from '@nestjs/common';
import { MarketplaceIndex } from '../common/type';
import { SearchHit } from '@elastic/elasticsearch/api/types';
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

  async findOneById(id: string): Promise<SearchHit<UserProfile>> {
    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.UserProfile, id) as Promise<
      SearchHit<UserProfile>
    >;
  }

  async findOneByAddress(address: string): Promise<SearchHit<UserProfile>> {
    return (
      await this.elasticService.searchByIndex(
        MarketplaceIndex.UserProfile,
        {
          bool: {
            must: {
              term: {
                addresses: address,
              },
            },
          },
        },
        undefined
      )
    ).hits?.[0] as SearchHit<UserProfile>;
  }
}
