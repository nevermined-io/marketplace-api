/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { faker } from '@faker-js/faker'
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { JwtStrategy } from '../common/strategies/jwt.strategy'
import { JwtAuthGuard } from '../common/guards/auth/jwt-auth.guard'
import { createWallet } from '../common/helpers/create-wallet.mock'
import { AuthService } from '../auth/auth.service'
import { LoginDto } from '../auth/dto/login.dto'
import { ConfigModule } from '../shared/config/config.module'
import { UserProfileModule } from '../user-profiles/user-profile.module'
import { UserProfile } from '../user-profiles/user-profile.entity'
import { UserProfileService } from '../user-profiles/user-profile.service'
import { MarketplaceIndex, PermissionType, State } from '../common/type'
import { PermissionModule } from './permission.module'
import { PermissionService } from './permission.service'
import { newPermission, permission } from './permission.mockup'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { SearchResults } from '../common/helpers/search-query.interface'

describe('Permission', () => {
  let app: INestApplication
  let token: LoginDto
  let authService: AuthService
  let permissionService: PermissionService

  const userProfile = new UserProfile()
  userProfile.addresses = ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B']
  userProfile.isListed = true
  userProfile.nickname = faker.internet.userName()
  userProfile.name = faker.person.fullName()
  userProfile.email = faker.internet.email()
  userProfile.state = State.Confirmed

  const permissionServiceMock = {
    createOne: (createPermissionDto) => createPermissionDto,
    findOneById: () => {
      return {
        _source: permission,
        _index: MarketplaceIndex.Permission,
        _id: permission.id,
      }
    },
    findManyByUserIdAndType: () => {
      return {
        hits: [],
        total: { value: 0, relation: 'eq' },
      }
    },

    updateOneByEntryId: (id: string, updatePermissionDto: UpdatePermissionDto) => {
      return {
        _source: { ...permission, ...updatePermissionDto },
        _index: MarketplaceIndex.Permission,
        _id: id,
      }
    },

    deleteOneByEntryId: () => undefined,
    checkIndex: () => true,
  }

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
              }
            },
          },
        },
      ],
    })
      .overrideProvider(PermissionService)
      .useValue(permissionServiceMock)
      .compile()

    authService = moduleRef.get<AuthService>(AuthService)
    permissionService = moduleRef.get<PermissionService>(PermissionService)
    app = moduleRef.createNestApplication()
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()))
    await app.init()

    token = await createWallet(authService)
  })

  it('/POST', async () => {
    const response = await request(app.getHttpServer())
      .post('/')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(permission)

    expect(response.statusCode).toBe(201)
    expect(response.body).toStrictEqual({
      ...permission,
      issuanceDate: permission.issuanceDate.toISOString(),
    })
  })

  it('/GET by id', async () => {
    const response = await request(app.getHttpServer()).get(`/${permission.id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({
      ...permission,
      issuanceDate: permission.issuanceDate.toISOString(),
    })
  })

  it('/GET by userId', async () => {
    const permisionHits = {
      hits: [
        {
          _source: permission,
          _index: MarketplaceIndex.Permission,
          _id: permission.id,
        },
      ],
      total: { value: 1, relation: 'eq' } as SearchResults,
    }

    jest.spyOn(permissionService, 'findManyByUserIdAndType').mockResolvedValue(permisionHits)
    const response = await request(app.getHttpServer()).get(`/user/${permission.userId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({
      total_results: { value: 1, relation: 'eq' },
      total_pages: 1,
      page: 1,
      results: [{ ...permission, issuanceDate: permission.issuanceDate.toISOString() }],
    })
  })

  it('/GET by userId and type', async () => {
    const permisionHits = {
      hits: [
        {
          _source: permission,
          _index: MarketplaceIndex.Permission,
          _id: permission.id,
        },
      ],
      total: { value: 1, relation: 'eq' } as SearchResults,
    }

    jest.spyOn(permissionService, 'findManyByUserIdAndType').mockResolvedValue(permisionHits)
    const response = await request(app.getHttpServer()).get(
      `/user/${permission.userId}/${PermissionType.Read}`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({
      total_results: { value: 1, relation: 'eq' },
      total_pages: 1,
      page: 1,
      results: [{ ...permission, issuanceDate: permission.issuanceDate.toISOString() }],
    })
  })

  it('/PUT by id', async () => {
    const response = await request(app.getHttpServer())
      .put(`/${newPermission.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)
      .send({
        type: newPermission.type,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual({
      ...newPermission,
      issuanceDate: newPermission.issuanceDate.toISOString(),
    })
  })

  it('/DELETE by id', async () => {
    await request(app.getHttpServer())
      .del(`/${permission.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)
      .expect(200)
  })
})
