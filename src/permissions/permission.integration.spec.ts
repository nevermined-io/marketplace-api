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
import { MarketplaceIndex, State } from '../common/type';
import { PermissionModule } from './permission.module';
import { PermissionService } from './permission.service';
import { permission } from './permission.mockup';

describe('Permission', () => {
  let app: INestApplication;
  let token: LoginDto;
  let authService: AuthService;

  const userProfile = new UserProfile();
  userProfile.addresses = ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'];
  userProfile.isListed = true;
  userProfile.nickname = faker.internet.userName();
  userProfile.name = faker.name.findName();
  userProfile.email = faker.internet.email();
  userProfile.state = State.Confirmed;

  const permissionService = {
    createOne: (createPermissionDto) => createPermissionDto,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PermissionModule,
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
      ],
    })
      .overrideProvider(PermissionService)
      .useValue(permissionService)
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
      .send(permission);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({ ...permission, issuanceDate: permission.issuanceDate.toISOString() });
  });
});
