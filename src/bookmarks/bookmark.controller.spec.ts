/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import { Logger } from '../shared/logger/logger.service';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.entity';
import { ElasticService } from '../shared/elasticsearch/elastic.service';
import { GetBookmarkDto } from './dto/get-bookmark.dto';
import { MarketplaceIndex } from '../common/type';

describe('BookmarkController', () => {
  let bookmarkController: BookmarkController;
  let bookmarkService: BookmarkService;

  const bookmark = new Bookmark();
  bookmark.userId = `u-${faker.datatype.uuid()}`;
  bookmark.did = `did:${faker.datatype.uuid()}`;
  bookmark.description = faker.lorem.sentence();

  const newBookmark = {...bookmark, description: faker.lorem.sentence()};

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
    jest.spyOn(bookmarkService, 'createOne').mockResolvedValue(bookmark);

    expect(await bookmarkController.createBookmark({
        userId: bookmark.userId,
        did: bookmark.did,
        description: bookmark.description,
    })).toStrictEqual(bookmark);
  });

  it('should get a bookmark by passing id', async () => {
    jest.spyOn(bookmarkService, 'findManyById').mockImplementation((id) => {
      if(id === bookmark.id) {
        return [{
          _source: bookmark,
          _index: MarketplaceIndex.Bookmark,
          _id: faker.datatype.uuid(),
        }] as any;
      }
    });

    expect(await bookmarkController.getBookmarkById(bookmark.id)).toStrictEqual(GetBookmarkDto.fromSource({
      _source: bookmark,
      _index: MarketplaceIndex.Bookmark,
      _id: faker.datatype.uuid(),
    }));
  });

  it('should throw error if cannot find the bookmark', () => {
    jest.spyOn(bookmarkService, 'findManyById').mockResolvedValue([]);

    expect(bookmarkController.getBookmarkById(bookmark.id))
      .rejects.toEqual(new NotFoundException(`Bookmark with ${bookmark.id} not found`));
  });

  it('should get all bookmarks of a user', async () => {
    jest.spyOn(bookmarkService, 'findManyByUserId').mockResolvedValue([{
      _source: bookmark,
      _index: MarketplaceIndex.Bookmark,
      _id: faker.datatype.uuid(),
    }]);

    expect(await bookmarkController.getBookmarksByUserId(bookmark.userId)).toStrictEqual([GetBookmarkDto.fromSource({
      _source: bookmark,
      _index: MarketplaceIndex.Bookmark,
      _id: faker.datatype.uuid(),
    })]);
  });

  it('should update bookmark by passing id', async() => {
    jest.spyOn(bookmarkService, 'findManyById').mockResolvedValue([{
      _source: bookmark,
      _index: MarketplaceIndex.Bookmark,
      _id: faker.datatype.uuid(),
    }]);

    jest.spyOn(bookmarkService, 'updateOneByEntryId').mockResolvedValue({
      _source: newBookmark,
      _index: MarketplaceIndex.Bookmark,
      _id: faker.datatype.uuid(),
    });

    expect(await bookmarkController.updateBookmarkById(bookmark.id, {
      description: newBookmark.description
    })).toStrictEqual(GetBookmarkDto.fromSource({
      _source: newBookmark,
      _index: MarketplaceIndex.Bookmark,
      _id: faker.datatype.uuid(),
    }));
  });

  it('should update throw error if bookmark with id passed does not exist', () => {
    jest.spyOn(bookmarkService, 'findManyById').mockResolvedValue([]);

    expect(bookmarkController.updateBookmarkById(bookmark.id, { description: newBookmark.description}))
      .rejects.toEqual(new NotFoundException(`Bookmark with ${bookmark.id} not found`));
  });

  it('should delete bookmark by passing id', async () => {
    const bookmarks = [
      { 
        _source: {...bookmark},
        _index: MarketplaceIndex.Bookmark,
        _id: faker.datatype.uuid()
      },
      {
        _source: {...newBookmark},
        _index: MarketplaceIndex.Bookmark,
        _id: faker.datatype.uuid()
      },
    ];

    jest.spyOn(bookmarkService, 'findManyById').mockResolvedValue([bookmarks[0]]);

    jest.spyOn(bookmarkService, 'deleteOneByEntryId').mockResolvedValue(undefined);

    jest.spyOn(bookmarkService, 'findManyByUserId')
      .mockImplementation(() => bookmarks.filter(b => b._id !== bookmarks[0]._id) as any
    );

    expect(await bookmarkController.deleteBookmarkById(bookmark.id))
      .toStrictEqual([GetBookmarkDto.fromSource(bookmarks[1])]);
  });

  it('should delete throw error if bookmark with id passed does not exist', () => {
    jest.spyOn(bookmarkService, 'findManyById').mockResolvedValue([]);

    expect(bookmarkController.deleteBookmarkById(bookmark.id))
      .rejects.toEqual(new NotFoundException(`Bookmark with ${bookmark.id} not found`));
  });
});