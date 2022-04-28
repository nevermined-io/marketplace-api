import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { CLIENT_ASSERTION_TYPE, EthSignJWT } from '../common/guards/shared/jwt.utils';
import { ethers } from 'ethers';
import { ConfigModule } from '../shared/config/config.module';
import { ConfigService } from '../shared/config/config.service';
import { UserProfileService } from '../user-profiles/user-profile.service';
import { UserProfile } from '../user-profiles/user-profile.entity';
import { State, MarketplaceIndex } from '../common/type';
import { JwtAuthGuard } from '../common/guards/auth/jwt-auth.guard';

describe('AuthController', () => {
  let app: INestApplication;
  let wallet: ethers.Wallet;
  let authService: AuthService;

  beforeAll(() => {
    wallet = ethers.Wallet.createRandom();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
        ConfigService,
        {
          provide: UserProfileService,
          useValue: {
            findOneByAddress: (address: string) => {
              const userProfile = new UserProfile();
              userProfile.addresses = [address];
              userProfile.nickname = address;
              userProfile.state = State.Confirmed;
              userProfile.isListed = true;

              return {
                _source: userProfile,
                _index: MarketplaceIndex.UserProfile,
                _id: userProfile.userId,
              };
            },
            findOneById: (id: string) => {
              const userProfile = new UserProfile();
              userProfile.userId = id;
              userProfile.addresses = [wallet.address];
              userProfile.state = State.Confirmed;
              userProfile.isListed = true;

              return {
                _source: userProfile,
                _index: MarketplaceIndex.UserProfile,
                _id: userProfile.userId,
              };
            },
            updateOneByEntryId: (userId: string, userProfileEntity: UserProfile) => ({
              _source: userProfileEntity,
              _index: MarketplaceIndex.UserProfile,
              _id: userId,
            }),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    app = module.createNestApplication();
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
    await app.init();
  });

  it('/POST login', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const response = await request(app.getHttpServer())
      .post('/login')
      .send(`client_assertion_type=${CLIENT_ASSERTION_TYPE}&client_assertion=${clientAssertion}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });

  it('POST address', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const currentToken = await authService.validateClaim(CLIENT_ASSERTION_TYPE, clientAssertion);

    const newWallet = ethers.Wallet.createRandom();

    const newClientAssertion = await new EthSignJWT({
      iss: newWallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(newWallet);

    const response = await request(app.getHttpServer())
      .post('/address')
      .set('Authorization', `Bearer ${currentToken.access_token}`)
      .send({
        client_assertion_type: CLIENT_ASSERTION_TYPE,
        client_assertion: newClientAssertion,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });
});
