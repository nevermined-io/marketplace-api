import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { decodeJwt } from 'jose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../common/strategies/jwt.strategy';
import { CLIENT_ASSERTION_TYPE, EthSignJWT } from '../common/guards/shared/jwt.utils';
import { ethers } from 'ethers';
import { State, MarketplaceIndex } from '../common/type';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '../shared/config/config.module';
import { ConfigService } from '../shared/config/config.service';
import { UserProfileService } from '../user-profiles/user-profile.service';
import { UserProfile } from '../user-profiles/user-profile.entity';
import { PermissionService } from '../permissions/permission.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userProfileService: UserProfileService;
  let wallet: ethers.Wallet;
  let clientAssertion: string;

  const userProfile = new UserProfile();
  userProfile.state = State.Confirmed;
  userProfile.isListed = true;

  beforeAll(() => {
    wallet = ethers.Wallet.createRandom();
  });

  beforeEach(async () => {
    const moduleMock: TestingModule = await Test.createTestingModule({
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
            createOne: (userProfileEntity: UserProfile) => userProfileEntity,
            findOneById: () => ({
              _source: userProfile,
              _index: MarketplaceIndex.UserProfile,
              _id: userProfile.userId,
            }),
            findOneByAddress: (address: string) => {
              userProfile.addresses = [address];
              userProfile.nickname = address;

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

            checkIndex: () => true,
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
            checkIndex: () => true,
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    authService = moduleMock.get<AuthService>(AuthService);
    userProfileService = moduleMock.get<UserProfileService>(UserProfileService);
  });

  it('should get an access token with an ethereum signed claim', async () => {
    clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const result = await authService.validateClaim(CLIENT_ASSERTION_TYPE, clientAssertion);
    expect(result).toHaveProperty('access_token');

    const payload = decodeJwt(result.access_token);
    expect(payload.iss).toEqual(wallet.address);
    expect(payload.sub).toEqual(userProfile.userId);
  });

  it('should fail with a wrong client_assertion_type', async () => {
    await expect(authService.validateClaim('', clientAssertion)).rejects.toEqual(
      new UnauthorizedException('Invalid "client_assertion_type"')
    );
  });

  it('should fail with a malformed JWT', async () => {
    await expect(authService.validateClaim(CLIENT_ASSERTION_TYPE, '')).rejects.toEqual(
      new UnauthorizedException("The 'client_assertion' is invalid: Invalid Compact JWS")
    );
  });

  it('should fail with wrong algorithm', async () => {
    const wrongClientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'bla' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    await expect(authService.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion)).rejects.toEqual(
      new UnauthorizedException("The 'client_assertion' is invalid: ProtectedHeader: Invalid algorithm")
    );
  });

  it('should fail if iss is not present in the claim', async () => {
    const wrongClientAssertion = await new EthSignJWT({})
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    await expect(authService.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion)).rejects.toEqual(
      new UnauthorizedException(`The 'client_assertion' is invalid: Payload: "iss" field is required`)
    );
  });

  it('should fail if iss is not a valid ethereum address', async () => {
    const wrongClientAssertion = await new EthSignJWT({
      iss: 'bla',
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    await expect(authService.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion)).rejects.toEqual(
      new UnauthorizedException(
        `The 'client_assertion' is invalid: Payload: "iss" field must be a valid ethereum address`
      )
    );
  });

  it('should fail if iss is not a checksum address', async () => {
    const wrongClientAssertion = await new EthSignJWT({
      iss: wallet.address.toLowerCase(),
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    await expect(authService.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion)).rejects.toEqual(
      new UnauthorizedException(`The 'client_assertion' is invalid: Payload: "iss" field must be a checksum address`)
    );
  });

  it('should fail if iss is not the signer of the JWT', async () => {
    const walletOther = ethers.Wallet.createRandom();
    const wrongClientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(walletOther);

    await expect(authService.validateClaim(CLIENT_ASSERTION_TYPE, wrongClientAssertion)).rejects.toEqual(
      new UnauthorizedException(`The 'client_assertion' is invalid: Payload: "iss" is not the signer of the payload`)
    );
  });

  it('should find user profile with the wallet address given', async () => {
    clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const findOneByAddressSpy = jest.spyOn(userProfileService, 'findOneByAddress');
    const createOneSpy = jest.spyOn(userProfileService, 'createOne');

    await authService.validateClaim(CLIENT_ASSERTION_TYPE, clientAssertion);

    expect(findOneByAddressSpy).toBeCalledTimes(1);
    expect(createOneSpy).toBeCalledTimes(0);
  });

  it('should create a new user profile with the wallet address given', async () => {
    clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const findOneByAddressSpy = jest.spyOn(userProfileService, 'findOneByAddress');

    findOneByAddressSpy.mockResolvedValue(undefined);
    const createOneSpy = jest.spyOn(userProfileService, 'createOne');

    await authService.validateClaim(CLIENT_ASSERTION_TYPE, clientAssertion);

    expect(findOneByAddressSpy).toBeCalledTimes(1);
    expect(createOneSpy).toBeCalledTimes(1);
  });

  it('should add wallet address to existing user profile', async () => {
    clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const currentToken = await authService.validateClaim(CLIENT_ASSERTION_TYPE, clientAssertion);

    const payload = decodeJwt(currentToken.access_token);

    const newWallet = ethers.Wallet.createRandom();

    const newClientAssertion = await new EthSignJWT({
      iss: newWallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(newWallet);

    const newToken = await authService.validateNewAddressClaim(
      {
        client_assertion_type: CLIENT_ASSERTION_TYPE,
        client_assertion: newClientAssertion,
      },
      payload.sub
    );

    const newPayload = decodeJwt(newToken.access_token);

    expect(newPayload.iss).toEqual(newWallet.address);
    expect(newPayload.sub).toEqual(userProfile.userId);
  });

  it('should fail if an existing user profile is added an existing wallet address', async () => {
    clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet);

    const result = await authService.validateClaim(CLIENT_ASSERTION_TYPE, clientAssertion);

    const payload = decodeJwt(result.access_token);

    await expect(
      authService.validateNewAddressClaim(
        {
          client_assertion: clientAssertion,
          client_assertion_type: CLIENT_ASSERTION_TYPE,
        },
        payload.sub
      )
    ).rejects.toEqual(
      new UnauthorizedException(
        `The 'client_assertion' is invalid: The address ${wallet.address}` +
          ` already exists in ${userProfile.nickname} account`
      )
    );
  });
});
