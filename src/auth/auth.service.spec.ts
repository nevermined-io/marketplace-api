import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from '../common/strategies/jwt.strategy'
import { ethers } from 'ethers'
import { State, MarketplaceIndex } from '../common/type'
import { UnauthorizedException } from '@nestjs/common'
import { ConfigModule } from '../shared/config/config.module'
import { ConfigService } from '../shared/config/config.service'
import { UserProfileService } from '../user-profiles/user-profile.service'
import { UserProfile } from '../user-profiles/user-profile.entity'
import { PermissionService } from '../permissions/permission.service'
import { jwtEthVerify, JWTPayload } from '@nevermined-io/passport-nevermined'
import { EthSignJWT } from '@nevermined-io/nevermined-sdk-js'
import { CLIENT_ASSERTION_TYPE } from '../common/guards/shared/jwt.utils'

describe('AuthService', () => {
  let authService: AuthService
  let userProfileService: UserProfileService
  let wallet: ethers.Wallet
  let jwtPayload: JWTPayload

  const userProfile = new UserProfile()
  userProfile.state = State.Confirmed
  userProfile.isListed = true

  beforeAll(async () => {
    wallet = ethers.Wallet.createRandom()
    jwtPayload = {
      iss: await wallet.getAddress(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000 + 3600),
    }
  })

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
              userProfile.addresses = [address]
              userProfile.nickname = address

              return {
                _source: userProfile,
                _index: MarketplaceIndex.UserProfile,
                _id: userProfile.userId,
              }
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
              }
            },
            checkIndex: () => true,
          },
        },
      ],
      controllers: [AuthController],
    }).compile()

    authService = moduleMock.get<AuthService>(AuthService)
    userProfileService = moduleMock.get<UserProfileService>(UserProfileService)
  })

  it('should get an access token with an ethereum signed claim', async () => {
    const result = await authService.validateClaim(jwtPayload)
    expect(result).toHaveProperty('access_token')

    const payload = jwtEthVerify(result.access_token)
    expect(payload.iss).toEqual(wallet.address)
    expect(payload.sub).toEqual(userProfile.userId)
  })

  it('should find user profile with the wallet address given', async () => {
    const findOneByAddressSpy = jest.spyOn(userProfileService, 'findOneByAddress')
    const createOneSpy = jest.spyOn(userProfileService, 'createOne')

    await authService.validateClaim(jwtPayload)

    expect(findOneByAddressSpy).toBeCalledTimes(1)
    expect(createOneSpy).toBeCalledTimes(0)
  })

  it('should create a new user profile with the wallet address given', async () => {
    const findOneByAddressSpy = jest.spyOn(userProfileService, 'findOneByAddress')

    findOneByAddressSpy.mockResolvedValue(undefined)
    const createOneSpy = jest.spyOn(userProfileService, 'createOne')

    await authService.validateClaim(jwtPayload)

    expect(findOneByAddressSpy).toBeCalledTimes(1)
    expect(createOneSpy).toBeCalledTimes(1)
  })

  it('should add wallet address to existing user profile', async () => {
    const currentToken = await authService.validateClaim(jwtPayload)

    const payload = jwtEthVerify(currentToken.access_token)

    const newWallet = ethers.Wallet.createRandom()

    const newClientAssertion = await new EthSignJWT({
      iss: newWallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(newWallet)

    const newToken = await authService.validateNewAddressClaim(
      {
        client_assertion_type: CLIENT_ASSERTION_TYPE,
        client_assertion: newClientAssertion,
      },
      payload.sub,
    )

    const newPayload = jwtEthVerify(newToken.access_token)

    expect(newPayload.iss).toEqual(newWallet.address)
    expect(newPayload.sub).toEqual(userProfile.userId)
  })

  it('should fail if an existing user profile is added an existing wallet address', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet)

    const result = await authService.validateClaim(jwtPayload)

    const payload = jwtEthVerify(result.access_token)

    await expect(
      authService.validateNewAddressClaim(
        {
          client_assertion: clientAssertion,
          client_assertion_type: CLIENT_ASSERTION_TYPE,
        },
        payload.sub,
      ),
    ).rejects.toEqual(
      new UnauthorizedException(
        `The 'client_assertion' is invalid: The address ${wallet.address}` +
          ` already exists in ${userProfile.nickname} account`,
      ),
    )
  })
})
