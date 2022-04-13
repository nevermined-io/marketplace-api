/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Logger } from '../shared/logger/logger.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from './user-profile.service';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { UserProfile } from './user-profile.entity';
import { State } from '../common/type';

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

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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

    userProfileService = module.get<UserProfileService>(UserProfileService);
    userProfileController = module.get<UserProfileController>(UserProfileController);
  });

  it('should create an user profile', async () => {
    jest.spyOn(userProfileService, 'createOne').mockResolvedValue(userProfile);

    expect(await userProfileController.createUserProfile(userProfile)).toStrictEqual(userProfile);
  });
});
