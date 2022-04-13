import { Post, Controller, Body } from '@nestjs/common';
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
}
