/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { Logger } from '../shared/logger/logger.service';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { permission } from './permission.mockup';

describe('UserProfileController', () => {
  let permissionController: PermissionController;
  let permissionService: PermissionService;

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
});
