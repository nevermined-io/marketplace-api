/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetModule } from './asset.module';
import { asset } from './asset.mockup';

describe('Asset', () => {
  let app: INestApplication;
  const assetService = {
    createOne: (asset_data) => asset_data,
    findAllIds: () => [asset.id],
    findAll: () => [{ _source: asset }],
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
    const response = await request(app.getHttpServer()).get('/ddo').send(asset);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([asset]);
  });
});
