/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing'
import { Logger } from '../shared/logger/logger.service'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'
import { ElasticService } from '../shared/elasticsearch/elastic.service'
import { permission, newPermission } from './permission.mockup'
import { MarketplaceIndex, PermissionType } from '../common/type'
import { GetPermissionDto } from './dto/get-permission.dto'
import { SearchResponse } from '../common/helpers/search-response.dto'

describe('UserProfileController', () => {
  let permissionController: PermissionController
  let permissionService: PermissionService

  const permisionSource = {
    _source: permission,
    _index: MarketplaceIndex.Permission,
    _id: permission.id,
  }

  beforeEach(async () => {
    const moduleMock = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [
        {
          provide: ElasticService,
          useValue: {
            addDocumentToIndex: (): void => {
              Logger.log<string>('add document to index')
            },
            searchByIndex: (): void => {
              Logger.log<string>('Searching')
            },
          },
        },
        PermissionService,
      ],
    }).compile()

    permissionService = moduleMock.get<PermissionService>(PermissionService)
    permissionController = moduleMock.get<PermissionController>(PermissionController)
  })

  it('It should create a permission', async () => {
    jest
      .spyOn(permissionService, 'createOne')
      .mockImplementation((createPermissionDto) => createPermissionDto as any)

    expect(await permissionController.createPermission(permission)).toStrictEqual(permission)
  })

  it('it should get a permission by passing Id', async () => {
    jest.spyOn(permissionService, 'findOneById').mockResolvedValue(permisionSource)

    expect(await permissionController.getPermissionById(permission.id)).toStrictEqual(
      GetPermissionDto.fromSource(permisionSource),
    )
  })

  it('it should get permissions by passing userId', async () => {
    jest.spyOn(permissionService, 'findManyByUserIdAndType').mockResolvedValue({
      hits: [permisionSource],
      total: {
        value: 1,
        relation: 'eq',
      },
    })

    const searchQueryDto = {
      page: 1,
      offset: 100,
    }

    expect(
      await permissionController.getPermissionByUserId(permission.userId, searchQueryDto),
    ).toStrictEqual(
      SearchResponse.fromSearchSources(
        searchQueryDto,
        {
          hits: [permisionSource],
          total: {
            value: 1,
            relation: 'eq',
          },
        },
        [permisionSource].map(GetPermissionDto.fromSource),
      ),
    )
  })

  it('It should get permission by passing userId and type', async () => {
    jest.spyOn(permissionService, 'findManyByUserIdAndType').mockResolvedValue({
      hits: [permisionSource],
      total: {
        value: 1,
        relation: 'eq',
      },
    })

    const searchQueryDto = {
      page: 1,
      offset: 100,
    }

    expect(
      await permissionController.getPermissionByUserIdAndType(
        permission.userId,
        PermissionType.Read,
        searchQueryDto,
      ),
    ).toStrictEqual(
      SearchResponse.fromSearchSources(
        searchQueryDto,
        {
          hits: [permisionSource],
          total: {
            value: 1,
            relation: 'eq',
          },
        },
        [permisionSource].map(GetPermissionDto.fromSource),
      ),
    )
  })

  it('should update permission by passing id', async () => {
    jest.spyOn(permissionService, 'updateOneByEntryId').mockResolvedValue({
      _source: newPermission,
      _index: MarketplaceIndex.Permission,
      _id: newPermission.id,
    })

    expect(
      await permissionController.updatePermissionById(permission.id, {
        type: newPermission.type,
      }),
    ).toStrictEqual(
      GetPermissionDto.fromSource({
        _source: newPermission,
        _index: MarketplaceIndex.Permission,
        _id: newPermission.id,
      }),
    )
  })

  it('should delete permission by passing id', async () => {
    const permissionServiceSpy = jest.spyOn(permissionService, 'deleteOneByEntryId')

    permissionServiceSpy.mockResolvedValue(undefined)

    await permissionController.deletePermissionById(permission.id)

    expect(permissionServiceSpy).toBeCalled()
  })
})
