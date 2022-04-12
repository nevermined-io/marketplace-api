/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Logger } from '../shared/logger/logger.service';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.entity';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { GetBookmarkDto } from './dto/get-bookmark.dto';
import { MarketplaceIndex } from '../common/type';
import { SearchResponse } from '../common/helpers/search-response.dto';

describe('BookmarkController', () => {
  let bookmarkController: BookmarkController;
  let bookmarkService: BookmarkService;

  const bookmark = new Bookmark();
  bookmark.userId = `u-${faker.datatype.uuid()}`;
  bookmark.did = `did:${faker.datatype.uuid()}`;
  bookmark.description = faker.lorem.sentence();

  const newBookmark = { ...bookmark, description: faker.lorem.sentence() };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BookmarkController],
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
        BookmarkService,
      ],
    }).compile();

    bookmarkService = module.get<BookmarkService>(BookmarkService);
    bookmarkController = module.get<BookmarkController>(BookmarkController);
  });

  it('should create a bookmark', async () => {
    jest.spyOn(bookmarkService, 'createOne').mockResolvedValue(bookmark);

    expect(
      await bookmarkController.createBookmark({
        userId: bookmark.userId,
        did: bookmark.did,
        description: bookmark.description,
      })
    ).toStrictEqual(bookmark);
  });

  it('should get a bookmark by passing id', async () => {
    jest.spyOn(bookmarkService, 'findOneById').mockImplementation((id) => {
      if (id === bookmark.id) {
        return {
          _source: bookmark,
          _index: MarketplaceIndex.Bookmark,
          _id: faker.datatype.uuid(),
        } as any;
      }
    });

    expect(await bookmarkController.getBookmarkById(bookmark.id)).toStrictEqual(
      GetBookmarkDto.fromSource({
        _source: bookmark,
        _index: MarketplaceIndex.Bookmark,
        _id: faker.datatype.uuid(),
      })
    );
  });

  it('should get all bookmarks of a user', async () => {
    const hits = {
      hits: [
        {
          _source: bookmark,
          _index: MarketplaceIndex.Bookmark,
          _id: faker.datatype.uuid(),
        },
      ],
      total: 1,
    };

    jest.spyOn(bookmarkService, 'findManyByUserId').mockResolvedValue(hits);

    expect(await bookmarkController.getBookmarksByUserId(bookmark.userId, { page: 0, offset: 100 })).toStrictEqual(
      SearchResponse.fromSearchSources({ page: 0, offset: 100 }, hits, hits.hits.map(GetBookmarkDto.fromSource))
    );
  });

  it('should update bookmark by passing id', async () => {
    jest.spyOn(bookmarkService, 'updateOneByEntryId').mockResolvedValue({
      _source: newBookmark,
      _index: MarketplaceIndex.Bookmark,
      _id: faker.datatype.uuid(),
    });

    expect(
      await bookmarkController.updateBookmarkById(bookmark.id, {
        description: newBookmark.description,
      })
    ).toStrictEqual(
      GetBookmarkDto.fromSource({
        _source: newBookmark,
        _index: MarketplaceIndex.Bookmark,
        _id: faker.datatype.uuid(),
      })
    );
  });

  it('should delete bookmark by passing id', async () => {
    const bookmarkServiceSpy = jest.spyOn(bookmarkService, 'deleteOneByEntryId');

    bookmarkServiceSpy.mockResolvedValue(undefined);

    await bookmarkController.deleteBookmarkById(bookmark.id);

    expect(bookmarkServiceSpy).toBeCalled();
  });
});
