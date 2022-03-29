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

describe('Asset', () => {
  let app: INestApplication;
  const created = 'Tue Mar 29 2020';
  const assetCopy = { ...asset, created, id: `div:nv:${faker.datatype.uuid()}` };

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
    deleteAll: () => undefined,
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
});
