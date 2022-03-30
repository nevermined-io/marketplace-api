/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetModule } from './asset.module';
import { asset } from './asset.mockup';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { MarketplaceIndex } from '../common/type';
import { Asset } from './asset.entity';

describe('Asset', () => {
  let app: INestApplication;
  const created = 'Tue Mar 29 2020';
  const assetCopy = { ...asset, created, id: `div:nv:${faker.datatype.uuid()}` };
  delete assetCopy.service;

  const assetService = {
    createOne: (asset_data) => asset_data,
    findManyIds: () => [asset.id],
    findMany: (query: SearchQueryDto) =>
      [asset, assetCopy]
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

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AssetModule],
    })
      .overrideProvider(AssetService)
      .useValue(assetService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/POST ddo', async () => {
    const response = await request(app.getHttpServer()).post('/ddo').send(asset);

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
    expect(response.body).toStrictEqual([asset, assetCopy]);
  });

  it('/GET ddo/query', async () => {
    const response = await request(app.getHttpServer()).get('/ddo/query?sort={"created": "asc"}');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([asset, assetCopy]);
  });

  it('/POST ddo/query', async () => {
    const response = await request(app.getHttpServer())
      .post('/ddo/query')
      .send({
        sort: {
          created: 'desc',
        },
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual([assetCopy, asset]);
  });

  it('DELETE ddo', async () => {
    const response = await request(app.getHttpServer()).delete('/ddo');

    expect(response.statusCode).toBe(200);
  });

  it('GET ddo/:did', async () => {
    const response = await request(app.getHttpServer()).get(`/ddo/${asset.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(asset);
  });

  it('PUT ddo/:did', async () => {
    const updateAsset = { ...asset, updated: new Date().toDateString() };
    const response = await request(app.getHttpServer()).put(`/ddo/${asset.id}`).send(updateAsset);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(updateAsset);
  });

  it('DELETE ddo/:did', async () => {
    const response = await request(app.getHttpServer()).delete(`/ddo/${asset.id}`);

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
});
