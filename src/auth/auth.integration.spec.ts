import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { EthSignJWT } from '../common/guards/shared/jwt.utils';
import { ethers } from 'ethers';
import { ConfigModule } from '../shared/config/config.module';
import { ConfigService } from '../shared/config/config.service';
import { UserProfileService } from '../user-profiles/user-profile.service';
import { UserProfile } from '../user-profiles/user-profile.entity';
import { State, MarketplaceIndex } from '../common/type';

describe('AuthController', () => {
  let app: INestApplication;
  let wallet: ethers.Wallet;

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
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    app = module.createNestApplication();
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

    const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';
    const response = await request(app.getHttpServer())
      .post('/login')
      .send(`client_assertion_type=${clientAssertionType}&client_assertion=${clientAssertion}`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('access_token');
  });
});
