/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AssetService } from './asset.service';
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
import { DDOStatusService } from './ddo-status.service';
import { ServiceDDOService } from './ddo-service.service';
import { AssetModule } from './asset.module';
import { asset, ddoStatus, service } from './asset.mockup';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { Asset } from './asset.entity';
import { PermissionService } from '../permissions/permission.service';

describe('Asset', () => {
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

  asset._nvm.userId = userProfile.userId;
  service.userId = userProfile.userId;

  const created = 'Tue Mar 29 2020';
  const assetCopy = { ...asset, created, id: `div:nv:${faker.datatype.uuid()}` };
  delete assetCopy.service;

  const assetService = {
    createOne: (asset_data) => asset_data,
    findManyIds: () => [asset.id],
    findMany: (query: SearchQueryDto) => ({
      hits: [asset, assetCopy]
        .sort((a, b) => {
          return query?.sort?.created === 'desc'
            ? new Date(a.created).getTime() - new Date(b.created).getTime()
            : new Date(b.created).getTime() - new Date(a.created).getTime();
        })
        .map((a) => ({
          _source: a,
          _index: MarketplaceIndex.Asset,
          _id: a.id,
        })),
      total: { value: 2, relation: 'eq' },
    }),
    findOneById: (id: string) =>
      [asset, assetCopy]
        .map((a) => ({
          _source: a,
          _index: MarketplaceIndex.Asset,
          _id: a.id,
        }))
        .find((a) => a._id === id),
    updateOneByEntryId: (id: string, assetToUpdate: Asset) => {
      const assetUpdated = { ...[asset, assetCopy].find((a) => a.id === assetToUpdate.id), ...assetToUpdate } as Asset;
      return {
        _source: assetUpdated,
        _index: MarketplaceIndex.Asset,
        _id: id,
      };
    },
    deleteAll: () => undefined,
    deleteOneByEntryId: () => undefined,
  };

  const ddosStatusService = {
    createOne: () => ({}),
    findOneById: (did: string) => ({
      _source: { ...ddoStatus },
      _index: MarketplaceIndex.DDOStatus,
      _id: did,
    }),
  };

  const serviceDDOService = {
    createOne: (servicePayload) => servicePayload,
    findOneById: (did: string) => ({
      _source: { ...service },
      _index: MarketplaceIndex.Service,
      _id: did,
    }),
    findMany: () => ({
      hits: [
        {
          _source: { ...service },
          _index: MarketplaceIndex.Service,
          _id: service.agreementId,
        },
      ],
      total: { value: 1, relation: 'eq' },
    }),
    deleteAll: () => undefined,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AssetModule,
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
      .overrideProvider(AssetService)
      .useValue(assetService)
      .overrideProvider(DDOStatusService)
      .useValue(ddosStatusService)
      .overrideProvider(ServiceDDOService)
      .useValue(serviceDDOService)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    app = moduleRef.createNestApplication();
    app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
    await app.init();

    token = await createWallet(authService);
  });

  it('/POST ddo', async () => {
    const response = await request(app.getHttpServer())
      .post('/ddo')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(asset);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(asset);
  });

  it('/GET', async () => {
    const response = await request(app.getHttpServer()).get('/');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([asset.id]);
  });

  it('/GET ddo', async () => {
    const response = await request(app.getHttpServer()).get('/ddo');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      page: 1,
      total_pages: 1,
      total_results: { value: 2, relation: 'eq' },
      results: [asset, assetCopy],
    });
  });

  it('/GET ddo/query', async () => {
    const response = await request(app.getHttpServer()).get('/ddo/query?sort={"created": "asc"}');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      page: 1,
      total_pages: 1,
      total_results: { value: 2, relation: 'eq' },
      results: [asset, assetCopy],
    });
  });

  it('/POST ddo/query', async () => {
    const response = await request(app.getHttpServer())
      .post('/ddo/query')
      .send({
        offset: 100,
        page: 1,
        sort: {
          created: 'desc',
        },
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      page: 1,
      total_pages: 1,
      total_results: { value: 2, relation: 'eq' },
      results: [assetCopy, asset],
    });
  });

  it('DELETE ddo', async () => {
    const response = await request(app.getHttpServer())
      .delete('/ddo')
      .set('Authorization', `Bearer ${token.access_token}`);

    expect(response.statusCode).toBe(200);
  });

  it('GET ddo/:did', async () => {
    const response = await request(app.getHttpServer()).get(`/ddo/${asset.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(asset);
  });

  it('PUT ddo/:did', async () => {
    const updateAsset = { ...asset, updated: new Date().toDateString() };
    const response = await request(app.getHttpServer())
      .put(`/ddo/${asset.id}`)
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(updateAsset);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(updateAsset);
  });

  it('DELETE ddo/:did', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/ddo/${asset.id}`)
      .set('Authorization', `Bearer ${token.access_token}`);

    expect(response.statusCode).toBe(200);
  });

  it('GET metadata/:did', async () => {
    const response = await request(app.getHttpServer()).get(`/metadata/${asset.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(asset.service[2].attributes);
  });

  it('GET metadata/:did', async () => {
    const response = await request(app.getHttpServer()).get(`/metadata/${assetCopy.id}`);

    expect(response.statusCode).toBe(404);
  });

  it('GET ddo/:did/status', async () => {
    const response = await request(app.getHttpServer()).get(`/ddo/${ddoStatus.did}/status`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(ddoStatus);
  });

  it('POST service', async () => {
    const response = await request(app.getHttpServer())
      .post('/service')
      .set('Authorization', `Bearer ${token.access_token}`)
      .send(service);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(service);
  });

  it('GET service/:agreementId', async () => {
    const response = await request(app.getHttpServer()).get(`/service/${service.agreementId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(service);
  });

  it('POST service/query', async () => {
    const response = await request(app.getHttpServer()).post('/service/query').send({
      offset: 100,
      page: 1,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      page: 1,
      total_pages: 1,
      total_results: { value: 1, relation: 'eq' },
      results: [service],
    });
  });

  it('DELETE service', async () => {
    const response = await request(app.getHttpServer())
      .delete('/service')
      .set('Authorization', `Bearer ${token.access_token}`);

    expect(response.statusCode).toBe(200);
  });
});
