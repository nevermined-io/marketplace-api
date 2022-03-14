/* eslint @typescript-eslint/no-unsafe-return: 0 */
/* eslint @typescript-eslint/no-floating-promises: 0 */
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Logger } from '../shared/logger/logger.service';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';
import { ElasticService } from '../shared/elasticsearch/elastic.service';

describe('OnboardingStepsController', () => {
  let greetingController: GreetingController;
  let greetingService: GreetingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [GreetingController],
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
        GreetingService],
    }).compile();

    greetingService = module.get<GreetingService>(GreetingService);
    greetingController = module.get<GreetingController>(GreetingController);
  });

  it('should create a greeting', async () => {
    const greetingServiceSpy = jest.spyOn(greetingService, 'addGreeting');

    greetingServiceSpy.mockResolvedValue(undefined);

    await greetingController.createGreeting({
      name: 'Pepe',
      message: 'Hello Pepe',
    });

    expect(greetingServiceSpy).toBeCalled();
  });

  it('should get greeting', async () => {
    jest.spyOn(greetingService, 'getGreeting').mockImplementation((name) => ([{
      _source: {
        name,
        message: `Hello ${name}`,
    }}] as any));

    expect(await greetingController.findGreeting('Pepe')).toStrictEqual({
      name: 'Pepe',
      message: 'Hello Pepe',
    });
  });

  it('should throw error if greeting is not found', () => {
    jest.spyOn(greetingService, 'getGreeting').mockImplementation(() => ([] as any));

    expect(greetingController.findGreeting('Paco'))
      .rejects
      .toEqual(new NotFoundException('Greeting from name Paco not found'));
  });
});