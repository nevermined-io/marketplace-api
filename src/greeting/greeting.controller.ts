import {
    Get,
    Post,
    Controller,
    Body,
    Param,
    NotFoundException
  } from '@nestjs/common';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { GreetingDTO } from './dto/greeting.dto';
  import { GreetingService } from './greeting.service';
  
  @ApiTags('Greeting')
  @Controller()
  export class GreetingController {
    constructor(
      private readonly greetingService: GreetingService
    ) {}

    @Post()
    @ApiOperation({
      description: 'Create a greeting',
    })
    @ApiResponse({
      status: 201,
      description: 'Greeting is created',
    })
    @ApiResponse({
      status: 403,
      description: 'Bad Request',
    })
    async createGreeting(@Body() greeting: GreetingDTO) {
      await this.greetingService.addGreeting(greeting);
    }
  
    @Get(':name')
    @ApiOperation({
      description: 'Get greeting from the user',
    })
    @ApiResponse({
      status: 200,
      description: 'Get onboarding steps',
    })
    @ApiResponse({
      status: 404,
      description: 'Not found.',
    })
    async findGreeting(@Param('name') name: string): Promise<GreetingDTO> {
      const result = await this.greetingService.getGreeting(name);

      if (!result.length) {
        throw new NotFoundException(`Greeting from name ${name} not found`);
      }

      return result.map((item) => item._source)[0];
    }
  }