/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserProfile } from './user-profile.entity';
import { State } from '../common/type';
import { UserProfileModule } from './user-profile.module';
import { UserProfileService } from './user-profile.service';

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

  const userProfileService = {
    createOne: (userProfileDto: UserProfile) => userProfileDto,
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
});
