/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { decodeJwt } from 'jose';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { JwtAuthGuard } from '../common/guards/auth/jwt-auth.guard';
import { createWallet } from '../common/helpers/create-wallet.mock';
import { ConfigModule } from '../shared/config/config.module';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { UserProfile } from './user-profile.entity';
import { MarketplaceIndex, State } from '../common/type';
import { UserProfileModule } from './user-profile.module';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PermissionService } from '../permissions/permission.service';

describe('User Profile', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userProfileServiceMock: UserProfileService;
  let token: LoginDto;
  let userIdAuth: string;
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

    updateOneByEntryId: (userId: string, updateUserProfileDto: UpdateUserProfileDto) => ({
      _source: updateUserProfileDto,
      _index: MarketplaceIndex.UserProfile,
      _id: userId,
    }),

    disableOneByEntryId: (userId: string) => ({
      ...userProfile,
      userId,
      state: State.Disabled,
    }),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UserProfileModule,
        ConfigModule,
        PassportModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [
        JwtStrategy,
        AuthService,
        {
          provide: PermissionService,
          useValue: {
            findManyByUserIdAndType: () => {
              return {
                hits: [],
              };
            },
            checkIndex: () => true,
          },
        },
      ],
    })
      .overrideProvider(UserProfileService)
      .useValue(userProfileService)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userProfileServiceMock = moduleRef.get<UserProfileService>(UserProfileService);
    app = moduleRef.createNestApplication();
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
    await app.init();

    token = await createWallet(authService);
    userIdAuth = decodeJwt(token.access_token).sub;
  });

  it('POST', async () => {
    jest.spyOn(userProfileServiceMock, 'findOneByAddress').mockResolvedValue(undefined);

    const response = await request(app.getHttpServer())
      .post('/')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(userProfile);

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
    jest.spyOn(userProfileServiceMock, 'findOneByAddress').mockImplementation((address: string) => {
      const source = [userProfile, userProfileTwo].find((u) => u.addresses.some((a) => a === address));

      if (source) {
        return {
          _source: source,
          _index: MarketplaceIndex.UserProfile,
          _id: source.userId,
        };
      }

      return undefined as any;
    });
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
    const newUserProfile = { ...userProfile, userId: userIdAuth, state: State.Disabled };

    const response = await request(app.getHttpServer())
      .put(`/${userIdAuth}`)
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(newUserProfile);

    expect(response.statusCode).toBe(200);
    expect((response.body as UserProfile).state).toEqual(State.Disabled);
  });

  it('DELETE disable user profile by userId', async () => {
    const disbledUserProfile = { ...userProfile, userId: userIdAuth, state: State.Disabled };

    const response = await request(app.getHttpServer())
      .delete(`/${userIdAuth}`)
      .set('Authorization', `Bearer ${token.access_token}`);

    expect(response.body).toStrictEqual({
      ...disbledUserProfile,
      creationDate: disbledUserProfile.creationDate.toISOString(),
      updateDate: disbledUserProfile.updateDate.toISOString(),
    });
  });
});
