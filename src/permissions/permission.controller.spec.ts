/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { Logger } from '../shared/logger/logger.service';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { permission } from './permission.mockup';
import { MarketplaceIndex } from '../common/type';
import { GetPermissionDto } from './dto/get-permission.dto';
import { SearchResponse } from '../common/helpers/search-response.dto';

describe('UserProfileController', () => {
  let permissionController: PermissionController;
  let permissionService: PermissionService;

  const permisionSource = {
    _source: permission,
    _index: MarketplaceIndex.Permission,
    _id: permission.id,
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PermissionController],
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
        PermissionService,
      ],
    }).compile();

    permissionService = module.get<PermissionService>(PermissionService);
    permissionController = module.get<PermissionController>(PermissionController);
  });

  it('It should create a permission', async () => {
    jest.spyOn(permissionService, 'createOne').mockImplementation((createPermissionDto) => createPermissionDto as any);

    expect(await permissionController.createPermission(permission)).toStrictEqual(permission);
  });

  it('it should get a permission by passing Id', async () => {
    jest.spyOn(permissionService, 'findOneById').mockResolvedValue(permisionSource);

    expect(await permissionController.getPermissionById(permission.id)).toStrictEqual(
      GetPermissionDto.fromSource(permisionSource)
    );
  });

  it('it should get permissions by passing userId', async () => {
    jest.spyOn(permissionService, 'findManyByUserId').mockResolvedValue({
      hits: [permisionSource],
    });

    const searchQueryDto = {
      page: 1,
      offset: 100,
    };

    expect(await permissionController.getPermissionByUserId(permission.userId, searchQueryDto)).toStrictEqual(
      SearchResponse.fromSearchSources(
        searchQueryDto,
        { hits: [permisionSource] },
        [permisionSource].map(GetPermissionDto.fromSource)
      )
    );
  });
});
