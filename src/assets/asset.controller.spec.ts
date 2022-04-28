/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Logger } from '../shared/logger/logger.service';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { DDOStatusService } from './ddo-status.service';
import { Asset } from './asset.entity';
import { DDOStatus } from './ddo-status.entity';
import { Service } from './ddo-service.entity';
import { MarketplaceIndex, SourceType, Status } from '../common/type';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { GetAssetDto } from './dto/get-asset-dto';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchResponse } from '../common/helpers/search-response.dto';
import { ServiceDto } from './dto/service.dto';
import { AttributesDto } from './dto/attributes.dto';
import { GetDDOStatusDto } from './dto/get-ddo-status.dto';
import { ServiceDDOService } from './ddo-service.service';
import { GetServiceDto } from './dto/get-service.dto';

describe('Asset', () => {
  let assetController: AssetController;
  let assetService: AssetService;
  let ddosStatusService: DDOStatusService;
  let serviceDDOService: ServiceDDOService;

  const asset = new Asset();
  asset.id = `did:nv:${faker.datatype.uuid()}`;
  asset['@context'] = 'https://w3id.org/did/v1';
  asset.created = new Date().toDateString();
  asset.userId = `u-${faker.datatype.uuid()}`;

  const ddoStatus = new DDOStatus();
  ddoStatus.did = asset.id;
  ddoStatus.external = null;
  ddoStatus.internal = {
    id: asset.id,
    type: SourceType.Elasticsearch,
    status: Status.Accepted,
    url: faker.internet.url(),
  };

  const service = new Service();
  service.agreementId = faker.datatype.uuid();
  service.index = faker.datatype.number();
  service.templateId = faker.datatype.uuid();
  service.type = 'metadata';
  service.attributes = new AttributesDto();

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
        DDOStatusService,
        AssetService,
        ServiceDDOService,
      ],
    }).compile();

    assetService = module.get<AssetService>(AssetService);
    ddosStatusService = module.get<DDOStatusService>(DDOStatusService);
    assetController = module.get<AssetController>(AssetController);
    serviceDDOService = module.get<ServiceDDOService>(ServiceDDOService);
  });

  it('should create a Asset', async () => {
    jest.spyOn(assetService, 'createOne').mockResolvedValue(asset);
    jest.spyOn(ddosStatusService, 'createOne').mockResolvedValue(undefined);

    expect(
      await assetController.createAsset(
        {
          url: '/api/v1/metadata/assets/ddo/',
          protocol: 'http',
          client: { localPort: 3100 },
          hostname: 'localhost',
          body: asset,
          params: undefined,
          query: undefined,
        },
        asset
      )
    ).toStrictEqual(asset);
  });

  it('should get all asset Ids', async () => {
    jest.spyOn(assetService, 'findManyIds').mockResolvedValue([asset.id]);

    expect(await assetController.getAllAssetIds(undefined)).toStrictEqual([asset.id]);
  });

  it('should get ddo for all the assets', async () => {
    const hits = {
      hits: [
        {
          _source: asset,
          _index: MarketplaceIndex.Asset,
          _id: faker.datatype.uuid(),
        },
      ],
      total: 1,
    };

    jest.spyOn(assetService, 'findMany').mockResolvedValue(hits);

    expect(await assetController.getDDOAllAssets({ page: 1, offset: 100 })).toStrictEqual(
      SearchResponse.fromSearchSources({ page: 1, offset: 100 }, hits, hits.hits.map(GetAssetDto.fromSource))
    );
  });

  it('should get a list of assets that match with the passed query', async () => {
    const created = 'Tue Mar 29 2020';
    const assetCopy = { ...asset, created, id: `div:nv:${faker.datatype.uuid()}` };
    const query = {
      sort: {
        created: 'desc',
      },
      offset: 100,
      page: 0,
    };

    const hits = (querystring: SearchQueryDto) => {
      const sources = [asset, assetCopy]
        .sort((a, b) => {
          return querystring.sort.created === 'desc'
            ? new Date(a.created).getTime() - new Date(b.created).getTime()
            : new Date(a.created).getTime() - new Date(b.created).getTime();
        })
        .map((a) => ({
          _source: a,
          _index: MarketplaceIndex.Asset,
          _id: a.id,
        }));

      return {
        hits: sources,
        total: 2,
      };
    };

    jest.spyOn(assetService, 'findMany').mockImplementation((querystring: SearchQueryDto) => hits(querystring) as any);

    expect(await assetController.listDDObyQuery(query as SearchQueryDto)).toStrictEqual(
      SearchResponse.fromSearchSources(
        query as SearchQueryDto,
        hits(query as SearchQueryDto),
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
      )
    );
  });

  it('should get a list of assets that match with the passed body query', async () => {
    const created = 'Tue Mar 29 2020';
    const assetCopy = { ...asset, created, id: `div:nv:${faker.datatype.uuid()}` };
    const query = {
      sort: {
        created: 'desc',
      },
      offset: 100,
      page: 0,
    };

    const hits = (querystring: SearchQueryDto) => {
      const sources = [asset, assetCopy]
        .sort((a, b) => {
          return querystring.sort.created === 'desc'
            ? new Date(a.created).getTime() - new Date(b.created).getTime()
            : new Date(a.created).getTime() - new Date(b.created).getTime();
        })
        .map((a) => ({
          _source: a,
          _index: MarketplaceIndex.Asset,
          _id: a.id,
        }));

      return {
        hits: sources,
        total: 2,
      };
    };

    jest.spyOn(assetService, 'findMany').mockImplementation((querystring: SearchQueryDto) => hits(querystring) as any);

    expect(
      await assetController.listDDObyQueryPost({
        sort: {
          created: 'desc',
        },
        offset: 100,
        page: 0,
      })
    ).toStrictEqual(
      SearchResponse.fromSearchSources(
        query as SearchQueryDto,
        hits(query as SearchQueryDto),
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
      )
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

  it('should get the status of the asset', async () => {
    jest.spyOn(ddosStatusService, 'findOneById').mockResolvedValue({
      _source: ddoStatus,
      _index: MarketplaceIndex.DDOStatus,
      _id: ddoStatus.did,
    });

    expect(await assetController.getDDOStatus(ddoStatus.did)).toStrictEqual(
      GetDDOStatusDto.fromSource({
        _source: ddoStatus,
        _index: MarketplaceIndex.DDOStatus,
        _id: ddoStatus.did,
      })
    );
  });

  it('should create a service', async () => {
    jest.spyOn(serviceDDOService, 'createOne').mockResolvedValue(service);

    expect(await assetController.createService(service)).toStrictEqual(service);
  });

  it('should get a service', async () => {
    jest.spyOn(serviceDDOService, 'findOneById').mockResolvedValue({
      _source: service,
      _index: MarketplaceIndex.Service,
      _id: service.agreementId,
    });

    expect(await assetController.getService(service.agreementId)).toStrictEqual(
      GetServiceDto.fromSource({
        _source: service,
        _index: MarketplaceIndex.Service,
        _id: service.agreementId,
      })
    );
  });

  it('should get services by query', async () => {
    const serviceHits = {
      hits: [
        {
          _source: service,
          _index: MarketplaceIndex.Service,
          _id: service.agreementId,
        },
      ],
      total: 1,
    };

    const query = { page: 0, offset: 100 };

    jest.spyOn(serviceDDOService, 'findMany').mockResolvedValue(serviceHits);

    expect(await assetController.getServiceQueryPost(query)).toStrictEqual(
      SearchResponse.fromSearchSources(query, serviceHits, serviceHits.hits.map(GetServiceDto.fromSource))
    );
  });

  it('should delete all services', async () => {
    const deleteAllServicesSpy = jest.spyOn(serviceDDOService, 'deleteAll');
    deleteAllServicesSpy.mockResolvedValue(undefined);

    await assetController.deleteAllServices();

    expect(deleteAllServicesSpy).toBeCalled();
  });
});
