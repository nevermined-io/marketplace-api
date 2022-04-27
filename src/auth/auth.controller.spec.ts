import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { ethers } from 'ethers';
import { decodeJwt } from 'jose';
import { ConfigService } from '../shared/config/config.service';
import { ConfigModule } from '../shared/config/config.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { EthSignJWT, CLIENT_ASSERTION_TYPE } from '../common/guards/shared/jwt.utils';
import { UserProfileService } from '../user-profiles/user-profile.service';
import { UserProfile } from '../user-profiles/user-profile.entity';
import { State, MarketplaceIndex } from '../common/type';

describe('AuthController', () => {
  let authController: AuthController;
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

    authController = module.get<AuthController>(AuthController);
  });

  it('should get an access_token', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);
    const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer';

    const response = await authController.login({
      client_assertion_type: clientAssertionType,
      client_assertion: clientAssertion,
    });
    expect(response).toHaveProperty('access_token');
  });

  it('should add new address to existing user profile', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const currentToken = await authController.login({
      client_assertion_type: CLIENT_ASSERTION_TYPE,
      client_assertion: clientAssertion,
    });

    const payload = decodeJwt(currentToken.access_token);

    const newWallet = ethers.Wallet.createRandom();

    const newClientAssertion = await new EthSignJWT({
      iss: newWallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(newWallet);

    const newToken = await authController.authNewAddress(
      {
        client_assertion_type: CLIENT_ASSERTION_TYPE,
        client_assertion: newClientAssertion,
      },
      {
        user: {
          address: payload.iss,
          userId: payload.sub,
        },
      }
    );

    expect(newToken).toHaveProperty('access_token');
  });
});
