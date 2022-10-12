/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Logger } from '../shared/logger/logger.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { UserProfile } from './user-profile.entity';
import { State } from '../common/type';
import { MarketplaceIndex } from '../common/type';
import { GetUserProfileDto } from './dto/get-user-profile.dto';

describe('UserProfileController', () => {
  let userProfileController: UserProfileController;
  let userProfileService: UserProfileService;

  const userProfile = new UserProfile();
  userProfile.userId = faker.datatype.uuid();
  userProfile.addresses = ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'];
  userProfile.creationDate = faker.date.past();
  userProfile.updateDate = faker.date.recent();
  userProfile.isListed = true;
  userProfile.nickname = faker.internet.userName();
  userProfile.name = faker.name.findName();
  userProfile.email = faker.internet.email();
  userProfile.state = State.Confirmed;

  const req = {
    url: '/api/v1/ugc/bookmarks',
    protocol: 'http',
    client: { localPort: 3100 },
    hostname: 'localhost',
    user: {
      roles: [],
      userId: userProfile.userId,
      address: undefined,
    },
  };

  const userProfileSource = {
    _source: userProfile,
    _index: MarketplaceIndex.UserProfile,
    _id: userProfile.userId,
  };

  beforeEach(async () => {
    const moduleMock = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [
        {
          provide: ElasticService,
          useValue: {
            addDocumentToIndex: (): void => {
              Logger.log<string>('add document to index');
            },
            searchByIndex: (): void => {
              Logger.log<string>('Searching');
            },
          },
        },
        UserProfileService,
      ],
    }).compile();

    userProfileService = moduleMock.get<UserProfileService>(UserProfileService);
    userProfileController = moduleMock.get<UserProfileController>(UserProfileController);
  });

  it('should create an user profile', async () => {
    jest.spyOn(userProfileService, 'createOne').mockResolvedValue(userProfile);

    jest.spyOn(userProfileService, 'findOneByAddress').mockResolvedValue(undefined);

    expect(await userProfileController.createUserProfile(userProfile)).toStrictEqual(userProfile);
  });

  it('should fail if some profile has already this address', async () => {
    jest.spyOn(userProfileService, 'findOneByAddress').mockResolvedValue(userProfileSource);

    await expect(userProfileController.createUserProfile(userProfile)).rejects.toEqual(
      new NotFoundException(
        `User profile with theses addresses [${userProfileSource._source.addresses[0]}] already exists`
      )
    );
  });

  it('should get a user profile passing user id', async () => {
    jest.spyOn(userProfileService, 'findOneById').mockResolvedValue(userProfileSource);

    expect(await userProfileController.getUserProfileByUserId(userProfile.userId)).toStrictEqual(
      GetUserProfileDto.fromSource(userProfileSource)
    );
  });

  it('should get a user profile passing an address', async () => {
    jest.spyOn(userProfileService, 'findOneByAddress').mockImplementation((address: string) => {
      if (userProfile.addresses.some((a) => a === address)) {
        return userProfileSource;
      }

      return undefined as any;
    });

    expect(await userProfileController.getUserProfileByAddress(userProfile.addresses[0])).toStrictEqual(
      GetUserProfileDto.fromSource(userProfileSource)
    );
  });

  it('should thorw error when no user profile is found by the address given', async () => {
    jest.spyOn(userProfileService, 'findOneByAddress').mockImplementation((address: string) => {
      if (userProfile.addresses.some((a) => a === address)) {
        return userProfileSource;
      }

      return undefined as any;
    });

    await expect(userProfileController.getUserProfileByAddress('12233')).rejects.toEqual(
      new NotFoundException('User profile with public address 12233 does not exist')
    );
  });

  it('should update user profile', async () => {
    const newUserProfile = { ...userProfile, state: State.Disabled };
    const newUserProfileSource = {
      _source: newUserProfile,
      _id: newUserProfile.userId,
      _index: MarketplaceIndex.UserProfile,
    };

    jest.spyOn(userProfileService, 'updateOneByEntryId').mockResolvedValue(newUserProfileSource);

    expect(
      await userProfileController.updateUserProfileByUserId(userProfile.userId, newUserProfile, req)
    ).toStrictEqual(GetUserProfileDto.fromSource(newUserProfileSource));
  });

  it('should disable user profile', async () => {
    const disabledUserProfile = { ...userProfile, state: State.Disabled };

    jest.spyOn(userProfileService, 'disableOneByEntryId').mockResolvedValue(disabledUserProfile);

    expect(await userProfileController.disableUserProfileByUserId(userProfile.userId, req)).toStrictEqual(
      disabledUserProfile
    );
  });
});
