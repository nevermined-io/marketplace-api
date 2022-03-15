/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BookmarkModule } from './bookmark.module';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from './bookmark.entity';

describe('Bookmark', () => {
    let app: INestApplication;
    const bookmark = new Bookmark();
    bookmark.userId = `u-${faker.datatype.uuid()}`;
    bookmark.did = `did:${faker.datatype.uuid()}`;
    bookmark.description = faker.lorem.sentence();

    const bookmarkService = {
        createOne: () => bookmark,
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
});