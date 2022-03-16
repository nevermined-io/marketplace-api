/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BookmarkModule } from './bookmark.module';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.entity';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

describe('Bookmark', () => {
    let app: INestApplication;
    const bookmark = new Bookmark();
    bookmark.userId = `u-${faker.datatype.uuid()}`;
    bookmark.did = `did:${faker.datatype.uuid()}`;
    bookmark.description = faker.lorem.sentence();

    const newBookmark = {...bookmark, description: faker.lorem.sentence()};

    const bookmarkService = {
        createOne: () => bookmark,
        findManyById: (id: string) => {
            return [{
                _source: bookmark,
                _id: faker.datatype.uuid(),
            }].filter(b => b._source.id === id);
        },
        findManyByUserId: (userId: string) => {
            return [{_source: bookmark}].filter(b => b._source.userId === userId);
        },
        updateOneByEntryId: (id: string, description: UpdateBookmarkDto) => {
            return {
                id,
                _source: {...bookmark, ...description},
            };
        }
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [BookmarkModule],
          })
            .overrideProvider(BookmarkService)
            .useValue(bookmarkService)
            .compile();
      
          app = moduleRef.createNestApplication();
          await app.init();
    });

    it('/Post', async () => {
        const response = await request(app.getHttpServer())
        .post('/')
        .send({
            userId: bookmark.userId,
            did: bookmark.did,
            description: bookmark.description,
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({...bookmark, createdAt: bookmark.createdAt.toISOString()});
    });

    it('/Get by id', async() => {
        const response = await request(app.getHttpServer())
            .get(`/${bookmark.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({...bookmark, createdAt: bookmark.createdAt.toISOString()});
    });

    it('/GET by id not found error', async() => {
        await request(app.getHttpServer())
            .get(`/${faker.datatype.uuid()}`)
            .expect(404);
    });

    it('/GET by userId', async() => {
        const response = await request(app.getHttpServer())
            .get(`/user/${bookmark.userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([{...bookmark, createdAt: bookmark.createdAt.toISOString()}]);
    });

    it('/PUT by id', async() => {
        const response = await request(app.getHttpServer())
            .put(`/${bookmark.id}`)
            .send({
                description: newBookmark.description
            });

            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({...newBookmark, createdAt: bookmark.createdAt.toISOString()});
    });
});