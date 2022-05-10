import { Injectable } from '@nestjs/common';
import { MarketplaceIndex, State } from '../common/type';
import { SearchHit } from '@elastic/elasticsearch/api/types';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { UserProfile } from './user-profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly elasticService: ElasticService) {}

  async createIndex() {
    await this.elasticService.createIndex(MarketplaceIndex.UserProfile);
  }

  async checkIndex(): Promise<boolean> {
    return (await this.elasticService.checkExistingIndex(MarketplaceIndex.UserProfile)).body;
  }

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
          match: {
            addresses: address,
          },
        },
        undefined
      )
    ).hits?.[0] as SearchHit<UserProfile>;
  }

  async updateOneByEntryId(
    entryId: string,
    updateUserProfileDto: UpdateUserProfileDto
  ): Promise<SearchHit<UserProfile>> {
    await this.elasticService.updateDocumentByIndexAndId(MarketplaceIndex.UserProfile, entryId, {
      doc: updateUserProfileDto,
    });

    return this.elasticService.getDocumentByIndexAndId(MarketplaceIndex.UserProfile, entryId) as Promise<
      SearchHit<UserProfile>
    >;
  }

  async disableOneByEntryId(entryId: string): Promise<UserProfile> {
    const userProfile = (
      (await this.elasticService.getDocumentByIndexAndId(
        MarketplaceIndex.UserProfile,
        entryId
      )) as SearchHit<UserProfile>
    )?._source;

    const disabledUserProfile = { ...userProfile, state: State.Disabled };

    await this.elasticService.updateDocumentByIndexAndId(MarketplaceIndex.UserProfile, entryId, {
      doc: disabledUserProfile,
    });

    return disabledUserProfile;
  }
}
