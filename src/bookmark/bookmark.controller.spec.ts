/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Logger } from '../shared/logger/logger.service';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.entity';
import { ElasticService } from '../shared/elasticsearch/elastic.service';

describe('BookmarkController', () => {
  let bookmarkController: BookmarkController;
  let bookmarkService: BookmarkService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        {
          provide: ElasticService,
            useValue: {addDocumentToIndex: (): void => {
                Logger.log<string>('add document to index');
            },
            searchByIndex: (): void => {
                Logger.log<string>('Searching');
            },
          }
        },
        BookmarkService],
    }).compile();

    bookmarkService = module.get<BookmarkService>(BookmarkService);
    bookmarkController = module.get<BookmarkController>(BookmarkController);
  });

  it('should create a bookmark', async () => {
    const bookmark = new Bookmark();
    bookmark.userId = `u-${faker.datatype.uuid()}`;
    bookmark.did = `did:${faker.datatype.uuid()}`;
    bookmark.description = faker.lorem.sentence();
    jest.spyOn(bookmarkService, 'createOne').mockResolvedValue(bookmark);

    expect(await bookmarkController.createBookmark({
        userId: bookmark.userId,
        did: bookmark.did,
        description: bookmark.description,
    })).toStrictEqual(bookmark);
  });
});