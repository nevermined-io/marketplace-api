import { Test } from '@nestjs/testing';
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
              console.log('add document to index');
            },
            async searchByIndex() {
              console.log('Searching');
            }
          }
        },
        GreetingService],
    }).compile();

    greetingService = module.get<GreetingService>(GreetingService);
    greetingController = module.get<GreetingController>(GreetingController);
  });

  it('should create a greeting', async () => {
    let greetingServiceSpy = jest.spyOn(greetingService, 'addGreeting');

    greetingServiceSpy.mockResolvedValue(undefined)

    await greetingController.createGreeting({
      name: 'Pepe',
      message: 'Hello Pepe'
    });

    expect(greetingServiceSpy).toBeCalled();
  });
});