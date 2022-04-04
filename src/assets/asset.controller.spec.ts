/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Logger } from '../shared/logger/logger.service';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Asset } from './asset.entity';
import { MarketplaceIndex } from '../common/type';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { GetAssetDto } from './dto/get-asset-dto';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { ServiceDto } from './dto/service.dto';
import { AttributesDto } from './dto/attributes.dto';

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

  it('should get one ddo passing the did', async () => {
    jest.spyOn(assetService, 'findOneById').mockResolvedValue({
      _source: asset,
      _index: MarketplaceIndex.Asset,
      _id: asset.id,
    });

    expect(await assetController.getDDO(asset.id)).toStrictEqual(
      GetAssetDto.fromSource({
        _source: asset,
        _index: MarketplaceIndex.Asset,
        _id: asset.id,
      })
    );
  });

  it('should update one ddo passing the did', async () => {
    const updateAsset = { ...asset, updated: new Date().toDateString() };

    jest.spyOn(assetService, 'updateOneByEntryId').mockImplementation((id, assetToUpdate) => {
      const assetUpdated = { ...asset, ...assetToUpdate };
      return {
        _source: assetUpdated,
        _index: MarketplaceIndex.Asset,
        _id: id,
      } as any;
    });

    expect(await assetController.updateDDO(asset.id, updateAsset)).toStrictEqual(
      GetAssetDto.fromSource({
        _source: updateAsset,
        _index: MarketplaceIndex.Asset,
        _id: updateAsset.id,
      })
    );
  });

  it('should delete one ddo passing the did', async () => {
    const deleteOneByEntryIdSpy = jest.spyOn(assetService, 'deleteOneByEntryId');

    deleteOneByEntryIdSpy.mockResolvedValue(undefined);

    await assetController.deleteDDO(asset.id);

    expect(deleteOneByEntryIdSpy).toBeCalled();
  });

  it('should get metadata from asset passing did', async () => {
    const assetWithAttribute = { ...asset };
    assetWithAttribute.service = [new ServiceDto()];
    assetWithAttribute.service[0].attributes = new AttributesDto();
    assetWithAttribute.service[0].attributes.curation = {
      numVotes: 100,
      rating: 0.1,
      schema: 'BINARY',
      isListed: true,
    };

    jest.spyOn(assetService, 'findOneById').mockResolvedValue({
      _source: assetWithAttribute,
      _index: MarketplaceIndex.Asset,
      _id: asset.id,
    });

    expect(await assetController.getDDOMetadata(asset.id)).toStrictEqual(
      GetAssetDto.fromSource({
        _source: assetWithAttribute,
        _index: MarketplaceIndex.Asset,
        _id: assetWithAttribute.id,
      }).service[0].attributes
    );
  });

  it('should throw error if metadata does not have attributes', async () => {
    jest.spyOn(assetService, 'findOneById').mockResolvedValue({
      _source: asset,
      _index: MarketplaceIndex.Asset,
      _id: asset.id,
    });

    await expect(assetController.getDDOMetadata(asset.id)).rejects.toEqual(
      new NotFoundException(`Asset with did ${asset.id} doesn't have metada`)
    );
  });
});