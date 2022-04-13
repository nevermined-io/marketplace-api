import { Post, Controller, Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';

@ApiTags('User Profile')
@Controller()
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @ApiOperation({
    description: 'Create a user profile entry',
  })
  @ApiResponse({
    status: 201,
    description: 'User profile is created',
    type: GetUserProfileDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  async createUserProfile(@Body() createUserProfileDto: CreateUserProfileDto): Promise<GetUserProfileDto> {
    return this.userProfileService.createOne(createUserProfileDto);
  }

  @Get(':userId')
  @ApiOperation({
    description: 'Get the metadata of a user profile ',
  })
  @ApiResponse({
    status: 201,
    description: 'User profile returned',
    type: GetUserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getUserProfileByUserId(@Param('userId') userId: string): Promise<GetUserProfileDto> {
    const userProfileSource = await this.userProfileService.findOneById(userId);

    return GetUserProfileDto.fromSource(userProfileSource);
  }
}
