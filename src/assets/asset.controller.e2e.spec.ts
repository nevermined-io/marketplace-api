import { faker } from '@faker-js/faker'
import { Test, TestingModule } from '@nestjs/testing'
import { Request } from 'express'
import { AssetController } from './asset.controller'
import { Asset } from './asset.entity'
import { AssetModule } from './asset.module'
import { AssetService } from './asset.service'
import { Service } from './ddo-service.entity'
import { AttributesDto } from './dto/attributes.dto'
import { MainDto } from './dto/main.dto'
import { ServiceDto } from './dto/service.dto'

const asset = new Asset()
asset['@context'] = 'https://w3id.org/did/v1'
asset.created = '2022-10-12T14:04:59Z'
asset._nvm = {
  userId: `u-${faker.string.uuid()}`,
  appId: '',
  versions: [],
}
asset.service = [new ServiceDto()]
asset.service[0].attributes = new AttributesDto()

const service = new Service()
service.agreementId = faker.string.uuid()
service.index = faker.number.int()
service.templateId = faker.string.uuid()
service.type = 'metadata'
service.attributes = new AttributesDto()

describe('Asset Controller e2e', () => {
  let moduleRef: TestingModule
  let assetController: AssetController

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AssetModule],
    }).compile()

    assetController = moduleRef.get<AssetController>(AssetController)

    const assetService = moduleRef.get<AssetService>(AssetService)
    if (!(await assetService.checkIndex())) {
      await assetService.createIndex()
    }

    await assetService.deleteAll()
  })

  it('should store the DDOs', async () => {
    // Test1
    let newAsset = { ...asset }
    newAsset.id = `did:nv:${faker.string.uuid()}`
    newAsset.service[0].attributes.main = new MainDto()
    newAsset.service[0].attributes.main.name = 'Test1'

    await assetController.createAsset(
      {
        url: '/api/v1/metadata/assets/ddo/',
        protocol: 'http',
        headers: { host: 'localhost:3100' },
      } as Request,
      {
        roles: [],
        userId: asset._nvm.userId,
        address: undefined,
      },
      newAsset,
    )

    // Test2
    newAsset = { ...asset }
    newAsset.id = `did:nv:${faker.string.uuid()}`
    newAsset.service[0].attributes.main = new MainDto()
    newAsset.service[0].attributes.main.name = 'Test2'

    await assetController.createAsset(
      {
        url: '/api/v1/metadata/assets/ddo/',
        protocol: 'http',
        headers: { host: 'localhost:3100' },
      } as Request,
      {
        roles: [],
        userId: asset._nvm.userId,
        address: undefined,
      },
      newAsset,
    )

    newAsset = { ...asset }
    newAsset.id = `did:nv:${faker.string.uuid()}`
    newAsset.service[0].attributes.main = new MainDto()
    newAsset.service[0].attributes.main.name = 'Test2'

    await assetController.createAsset(
      {
        url: '/api/v1/metadata/assets/ddo/',
        protocol: 'http',
        headers: { host: 'localhost:3100' },
      } as Request,
      {
        roles: [],
        userId: asset._nvm.userId,
        address: undefined,
      },
      newAsset,
    )

    // Test3
    newAsset = { ...asset }
    newAsset.id = `did:nv:${faker.string.uuid()}`
    newAsset.service[0].attributes.main = new MainDto()
    newAsset.service[0].attributes.main.name = 'Test3'

    await assetController.createAsset(
      {
        url: '/api/v1/metadata/assets/ddo/',
        protocol: 'http',
        headers: { host: 'localhost:3100' },
      } as Request,
      {
        roles: [],
        userId: asset._nvm.userId,
        address: undefined,
      },
      newAsset,
    )

    // wait for elasticsearch
    await new Promise((r) => setTimeout(r, 2000))
  })

  it('should query with wildcard', async () => {
    const results = await assetController.listDDObyQueryPost({
      query: {
        simple_query_string: { query: 'Test*' },
      },
      sort: {
        created: 'desc',
      },
      offset: 100,
      page: 0,
    })

    expect(results.total_results.value).toEqual(4)
  })

  it('should query by word', async () => {
    let results = await assetController.listDDObyQueryPost({
      query: {
        simple_query_string: { query: 'Test1' },
      },
      sort: {
        created: 'desc',
      },
      offset: 100,
      page: 0,
    })
    expect(results.total_results.value).toEqual(1)

    results = await assetController.listDDObyQueryPost({
      query: {
        simple_query_string: { query: 'Test2' },
      },
      sort: {
        created: 'desc',
      },
      offset: 100,
      page: 0,
    })
    expect(results.total_results.value).toEqual(2)

    results = await assetController.listDDObyQueryPost({
      query: {
        simple_query_string: { query: 'Test3' },
      },
      sort: {
        created: 'desc',
      },
      offset: 100,
      page: 0,
    })
    expect(results.total_results.value).toEqual(1)
  })

  it('should delete by word', async () => {
    // assetController.deleteDDO("did:nv:0167a78d-59d5-4f28-8640-dfa51cf2382f",       {
    //   roles: [],
    //   userId: asset._nvm.userId,
    //   address: undefined,
    // },)
    assetController.deleteAllDDOs()
    const results = await assetController.listDDObyQueryPost({
      query: {
        simple_query_string: { query: '' },
      },
      sort: {
        created: 'desc',
      },
      offset: 100,
      page: 0,
    })
    console.log(results.total_results.value)
    expect(results.total_results.value).toEqual(0)
  })
})
