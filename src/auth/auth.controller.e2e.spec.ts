import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test, TestingModule } from '@nestjs/testing'
import { ethers } from 'ethers'
import { ConfigService } from '../shared/config/config.service'
import { ConfigModule } from '../shared/config/config.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from '../common/strategies/jwt.strategy'
import { UserProfileService } from '../user-profiles/user-profile.service'
import { UserProfile } from '../user-profiles/user-profile.entity'
import { State, MarketplaceIndex } from '../common/type'
import { PermissionService } from '../permissions/permission.service'
import { NeverminedStrategy } from './nvm.strategy'
import { INestApplication } from '@nestjs/common'
import { EthSignJWT } from '@nevermined-io/sdk'
import request from 'supertest'
import { ApplicationModule } from '../app.module'

describe('AuthController', () => {
  let app: INestApplication
  let wallet: ethers.Wallet

  beforeAll(async () => {
    wallet = ethers.Wallet.createRandom()

    const moduleMock: TestingModule = await Test.createTestingModule({
      imports: [
        ApplicationModule,
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
        NeverminedStrategy,
        {
          provide: UserProfileService,
          useValue: {
            findOneById: (id: string) => {
              const userProfile = new UserProfile()
              userProfile.userId = id
              userProfile.addresses = [wallet.address]
              userProfile.state = State.Confirmed
              userProfile.isListed = true

              return {
                _source: userProfile,
                _index: MarketplaceIndex.UserProfile,
                _id: userProfile.userId,
              }
            },
            findOneByAddress: (address: string) => {
              const userProfile = new UserProfile()
              userProfile.addresses = [address]
              userProfile.nickname = address
              userProfile.state = State.Confirmed
              userProfile.isListed = true

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

    app = moduleMock.createNestApplication()
    await app.init()
  })

  it('should get an access_token', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet)
    const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'

    // how to construct a request object
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({
        client_assertion_type: clientAssertionType,
        client_assertion: clientAssertion,
      })
      .expect(201)

    expect(response.body).toHaveProperty('access_token')
  })

  it('should add new address to existing user profile', async () => {
    const clientAssertion = await new EthSignJWT({
      iss: wallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(wallet)
    const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'

    // how to construct a request object
    const response = await request(app.getHttpServer())
      .post('/login')
      .send({
        client_assertion_type: clientAssertionType,
        client_assertion: clientAssertion,
      })
      .expect(201)

    const newWallet = ethers.Wallet.createRandom()

    const newClientAssertion = await new EthSignJWT({
      iss: newWallet.address,
    })
      .setProtectedHeader({ alg: 'ES256K' })
      .setIssuedAt()
      .setExpirationTime('60m')
      .ethSign(newWallet)

    const newTokenResponse = await request(app.getHttpServer())
      .post('/address')
      .set('Authorization', `Bearer ${response.body.access_token}`)
      .send({
        client_assertion_type: clientAssertionType,
        client_assertion: newClientAssertion,
      })
      .expect(201)

    expect(newTokenResponse.body).toHaveProperty('access_token')
  }, 10000)

  afterAll(async () => {
    await app.close()
  })
})
