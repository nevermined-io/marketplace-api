import request from 'supertest';
import { Test } from '@nestjs/testing';
import { Logger } from '../shared/logger/logger.service';
import { INestApplication } from '@nestjs/common';
import { GreetingModule } from '../greeting/greeting.module';
import { GreetingService } from '../greeting/greeting.service';

describe('Greeting', () => {
    let app: INestApplication;
    const greetingService = {
        addGreeting: (body) => {
            Logger.log(body);
        },
        getGreeting: (name) => {
            return {
                name,
                message: `Hello ${name}`,
            };
        },
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [GreetingModule],
          })
            .overrideProvider(GreetingService)
            .useValue(greetingService)
            .compile();
      
          app = moduleRef.createNestApplication();
          await app.init();
    });

    it(`/Post`, () => {
        return request(app.getHttpServer())
        .post('/greeting')
        .send({
            name: 'Pepe',
            message: 'Hello Pepe',
        })
        .expect(201);
    });

    it(`/Get`, async () => {
        const response = await request(app.getHttpServer())
        .get('/greeting/Pepe');

        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual({
            name: 'Pepe',
            message: 'Hello Peppe',
        });
    });

    afterAll(async () => {
        await app.close();
    });
});