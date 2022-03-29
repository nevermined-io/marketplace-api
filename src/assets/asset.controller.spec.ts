/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Logger } from '../shared/logger/logger.service';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Asset } from './asset.entity';
import { MarketplaceIndex } from '../common/type';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { GetAssetDto } from './dto/get-asset-dto';
import { SearchQueryDto } from '../common/helpers/search-query.dto';

describe('Asset', () => {
  let assetController: AssetController;
  let assetService: AssetService;

  const asset = new Asset();
  asset.id = `did:nv:${faker.datatype.uuid()}`;
  asset['@context'] = 'https://w3id.org/did/v1';
  asset.created = new Date().toDateString();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        {
          provide: ElasticService,
          useValue: {
            addDocumentToIndex: (): void => {
              Logger.log<string>('add document to index');
            },
            searchByIndex: (): void => {
              Logger.log<string>('Searching');
            },
          },
        },
        AssetService,
      ],
    }).compile();

    assetService = module.get<AssetService>(AssetService);
    assetController = module.get<AssetController>(AssetController);
  });

  it('should create a Asset', async () => {
    jest.spyOn(assetService, 'createOne').mockResolvedValue(asset);

    expect(await assetController.createAsset(asset)).toStrictEqual(asset);
  });

  it('should get all asset Ids', async () => {
    jest.spyOn(assetService, 'findManyIds').mockResolvedValue([asset.id]);

    expect(await assetController.getAllAssetIds(undefined)).toStrictEqual([asset.id]);
  });

  it('should get ddo for all the assets', async () => {
    jest.spyOn(assetService, 'findMany').mockResolvedValue([
      {
        _source: asset,
        _index: MarketplaceIndex.Asset,
        _id: asset.id,
      },
    ]);

    expect(await assetController.getDDOAllAssets(undefined)).toStrictEqual([
      GetAssetDto.fromSource({
        _source: asset,
        _index: MarketplaceIndex.Asset,
        _id: asset.id,
      }),
    ]);
  });

  it('should get a list of assets that match with the passed query', async () => {
    const created = 'Tue Mar 29 2020';
    const assetCopy = { ...asset, created, id: `div:nv:${faker.datatype.uuid()}` };
    jest.spyOn(assetService, 'findMany').mockImplementation((query: SearchQueryDto) => {
      return [asset, assetCopy]
        .sort((a, b) => {
          return query.sort.created === 'desc'
            ? new Date(a.created).getTime() - new Date(b.created).getTime()
            : new Date(a.created).getTime() - new Date(b.created).getTime();
        })
        .map((a) => ({
          _source: a,
          _index: MarketplaceIndex.Asset,
          _id: a.id,
        })) as any;
    });

    expect(
      await assetController.listDDObyQuery({
        sort: {
          created: 'desc',
        },
        offset: 100,
        page: 0,
      })
    ).toStrictEqual(
      [
        {
          _source: assetCopy,
          _index: MarketplaceIndex.Asset,
          _id: assetCopy.id,
        },
        {
          _source: asset,
          _index: MarketplaceIndex.Asset,
          _id: asset.id,
        },
      ].map((a) => GetAssetDto.fromSource(a))
    );
  });

  it('should get a list of assets that match with the passed body query', async () => {
    const created = 'Tue Mar 29 2020';
    const assetCopy = { ...asset, created, id: `div:nv:${faker.datatype.uuid()}` };
    jest.spyOn(assetService, 'findMany').mockImplementation((query: SearchQueryDto) => {
      return [asset, assetCopy]
        .sort((a, b) => {
          return query.sort.created === 'desc'
            ? new Date(a.created).getTime() - new Date(b.created).getTime()
            : new Date(b.created).getTime() - new Date(a.created).getTime();
        })
        .map((a) => ({
          _source: a,
          _index: MarketplaceIndex.Asset,
          _id: a.id,
        })) as any;
    });

    expect(
      await assetController.listDDObyQueryPost({
        sort: {
          created: 'desc',
        },
        offset: 100,
        page: 0,
      })
    ).toStrictEqual(
      [
        {
          _source: assetCopy,
          _index: MarketplaceIndex.Asset,
          _id: assetCopy.id,
        },
        {
          _source: asset,
          _index: MarketplaceIndex.Asset,
          _id: asset.id,
        },
      ].map((a) => GetAssetDto.fromSource(a))
    );
  });

  it('should delete all assets from marketplace', async () => {
    const deleteAllDDOsSpy = jest.spyOn(assetService, 'deleteAll');
    deleteAllDDOsSpy.mockResolvedValue(undefined);

    await assetController.deleteAllDDOs();

    expect(deleteAllDDOsSpy).toBeCalled();
  });
});
