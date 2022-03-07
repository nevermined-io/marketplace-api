import { Test } from '@nestjs/testing';
import { GreetingController } from './greeting.controller';
import { GreetingService } from './greeting.service';

describe('OnboardingStepsController', () => {
  let greetingController: GreetingController;
  let greetingService: GreetingService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [GreetingController],
      providers: [
      ],
    }).compile();

    greetingService = module.get<GreetingService>(GreetingService);
    greetingController = module.get<GreetingController>(GreetingController);
  });

  it('should create a greeting', async () => {
  });
});