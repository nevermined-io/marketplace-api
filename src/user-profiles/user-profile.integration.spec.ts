/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserProfile } from './user-profile.entity';
import { MarketplaceIndex, State } from '../common/type';
import { UserProfileModule } from './user-profile.module';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

describe('User Profile', () => {
  let app: INestApplication;
  const userProfile = new UserProfile();
  userProfile.userId = faker.datatype.uuid();
  userProfile.addresses = ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'];
  userProfile.isListed = true;
  userProfile.nickname = faker.internet.userName();
  userProfile.name = faker.name.findName();
  userProfile.email = faker.internet.email();
  userProfile.state = State.Confirmed;

  const userProfileTwo = {
    ...userProfile,
    name: faker.name.findName(),
    nickname: faker.internet.userName(),
    email: faker.internet.email(),
    addresses: ['0x47BB53e3d293494DE59fBe1FF78500423dcFd43C'],
  };

  const userProfileService = {
    createOne: (createUserProfileDto: CreateUserProfileDto) => createUserProfileDto,
    findOneById: () => ({
      _source: userProfile,
      _index: MarketplaceIndex.UserProfile,
      _id: userProfile.userId,
    }),
    findOneByAddress: (address: string) => {
      const source = [userProfile, userProfileTwo].find((u) => u.addresses.some((a) => a === address));

      if (source) {
        return {
          _source: source,
          _index: MarketplaceIndex.UserProfile,
          _id: source.userId,
        };
      }

      return undefined;
    },

    updateOneByEntryId: (userId, updateUserProfileDto: UpdateUserProfileDto) => {
      const source = [userProfile, userProfileTwo].find((u) => u.userId === userId);

      if (source) {
        return {
          _source: { ...source, ...updateUserProfileDto },
          _index: MarketplaceIndex.UserProfile,
          _id: source.userId,
        };
      }

      return undefined;
    },
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UserProfileModule],
    })
      .overrideProvider(UserProfileService)
      .useValue(userProfileService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST', async () => {
    const response = await request(app.getHttpServer()).post('/').send(userProfile);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      ...userProfile,
      creationDate: userProfile.creationDate.toISOString(),
      updateDate: userProfile.updateDate.toISOString(),
    });
  });

  it('GET by userId', async () => {
    const response = await request(app.getHttpServer()).get(`/${userProfile.userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      ...userProfile,
      creationDate: userProfile.creationDate.toISOString(),
      updateDate: userProfile.updateDate.toISOString(),
    });
  });

  it('GET by address', async () => {
    const response = await request(app.getHttpServer()).get(`/address/${userProfileTwo.addresses[0]}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      ...userProfileTwo,
      creationDate: userProfileTwo.creationDate.toISOString(),
      updateDate: userProfileTwo.updateDate.toISOString(),
    });
  });

  it('GET by address not found', async () => {
    const response = await request(app.getHttpServer()).get('/address/12334');

    expect(response.statusCode).toBe(404);
  });

  it('PUT by userId', async () => {
    const newUserProfile = { ...userProfile, state: State.Disabled };

    const response = await request(app.getHttpServer()).put(`/${userProfile.userId}`).send(newUserProfile);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      ...newUserProfile,
      creationDate: newUserProfile.creationDate.toISOString(),
      updateDate: newUserProfile.updateDate.toISOString(),
    });
  });
});
