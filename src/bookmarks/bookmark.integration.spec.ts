/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { JwtAuthGuard } from '../common/guards/auth/jwt-auth.guard';
import { createWallet } from '../common/helpers/create-wallet.mock';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { ConfigModule } from '../shared/config/config.module';
import { UserProfileModule } from '../user-profiles/user-profile.module';
import { UserProfile } from '../user-profiles/user-profile.entity';
import { UserProfileService } from '../user-profiles/user-profile.service';
import { State, MarketplaceIndex } from '../common/type';
import { BookmarkModule } from './bookmark.module';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.entity';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PermissionService } from '../permissions/permission.service';

describe('Bookmark', () => {
  let app: INestApplication;
  const bookmark = new Bookmark();
  let token: LoginDto;
  let authService: AuthService;

  const userProfile = new UserProfile();
  userProfile.addresses = ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'];
  userProfile.isListed = true;
  userProfile.nickname = faker.internet.userName();
  userProfile.name = faker.name.findName();
  userProfile.email = faker.internet.email();
  userProfile.state = State.Confirmed;

  bookmark.userId = userProfile.userId;
  bookmark.did = `did:${faker.datatype.uuid()}`;
  bookmark.description = faker.lorem.sentence();

  const newBookmark = { ...bookmark, description: faker.lorem.sentence() };

  const bookmarkService = {
    createOne: () => bookmark,
    findOneById: () => {
      return {
        _source: bookmark,
        _id: faker.datatype.uuid(),
      };
    },
    findManyByUserId: (userId: string) => {
      return {
        total: 1,
        hits: [{ _source: bookmark }].filter((b) => b._source.userId === userId),
      };
    },
    updateOneByEntryId: (id: string, description: UpdateBookmarkDto) => {
      return {
        id,
        _source: { ...bookmark, ...description },
      };
    },
    deleteOneByEntryId: () => undefined,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        BookmarkModule,
        UserProfileModule,
        ConfigModule,
        PassportModule,
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: UserProfileService,
          useValue: {
            findOneByAddress: () => {
              return {
                _source: userProfile,
                _index: MarketplaceIndex.UserProfile,
                _id: userProfile.userId,
              };
            },
          },
        },
        {
          provide: PermissionService,
          useValue: {
            findManyByUserIdAndType: () => {
              return {
                hits: [],
              };
            },
          },
        },
      ],
    })
      .overrideProvider(BookmarkService)
      .useValue(bookmarkService)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    app = moduleRef.createNestApplication();
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
    await app.init();

    token = await createWallet(authService);
  });

  it('/POST', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send({
        userId: bookmark.userId,
        did: bookmark.did,
        description: bookmark.description,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({ ...bookmark, createdAt: bookmark.createdAt.toISOString() });
  });

  it('/GET by id', async () => {
    const response = await request(app.getHttpServer()).get(`/${bookmark.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ ...bookmark, createdAt: bookmark.createdAt.toISOString() });
  });

  it('/GET by userId', async () => {
    const response = await request(app.getHttpServer()).get(`/user/${bookmark.userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      total_results: 1,
      total_pages: 1,
      page: 1,
      results: [{ ...bookmark, createdAt: bookmark.createdAt.toISOString() }],
    });
  });

  it('/PUT by id', async () => {
    const response = await request(app.getHttpServer())
      .put(`/${bookmark.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)
      .send({
        description: newBookmark.description,
        userId: newBookmark.userId,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({ ...newBookmark, createdAt: bookmark.createdAt.toISOString() });
  });

  it('/DELETE by id', async () => {
    await request(app.getHttpServer())
      .del(`/${bookmark.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)
      .expect(200);
  });
});
