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
            async addDocumentToIndex() {
              Logger.log('add document to index');
            },
            async searchByIndex() {
              Logger.log('Searching');
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

  it('should throw error if greeting is not found', async () => {
    jest.spyOn(greetingService, 'getGreeting').mockImplementation(() => ([] as any));

    expect(greetingController.findGreeting('Paco')).rejects.toEqual(new NotFoundException('Greeting from name Paco not found'));
  });
});