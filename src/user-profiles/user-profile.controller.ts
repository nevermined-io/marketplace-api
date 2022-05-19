import {
  Post,
  Controller,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { DisableUserProfileDto } from './dto/disable-user-profile.dto';
import { Public } from '../common/decorators/auth.decorator';
import { Roles } from '../common/decorators/roles.decorators';
import { UserMatchId } from '../common/guards/auth/user-match-id.guard';
import { AuthRoles } from '../common/type';

@ApiTags('User Profile')
@Controller()
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Post()
  @Roles(AuthRoles.Admin)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Create a user profile entry',
    summary: 'Admin',
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createUserProfile(@Body() createUserProfileDto: CreateUserProfileDto): Promise<GetUserProfileDto> {
    const userProfile = (
      await Promise.all(
        createUserProfileDto.addresses.map(async (a) => {
          const userProfileSource = await this.userProfileService.findOneByAddress(a);
          return userProfileSource?._source;
        })
      )
    ).filter((u) => u?.addresses);

    if (userProfile?.length) {
      const addresses: string[] = [];
      userProfile.forEach((up) => {
        addresses.push(...createUserProfileDto.addresses.filter((a) => up.addresses.some((aup) => aup === a)));
      });
      throw new BadRequestException(
        `User profile with theses addresses [${addresses.map((a) => a).join(',')}] already exists`
      );
    }

    return this.userProfileService.createOne(createUserProfileDto);
  }

  @Get(':userId')
  @ApiOperation({
    description: 'Get the metadata of a user profile ',
    summary: 'Public',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile returned',
    type: GetUserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @Public()
  async getUserProfileByUserId(@Param('userId') userId: string): Promise<GetUserProfileDto> {
    const userProfileSource = await this.userProfileService.findOneById(userId);

    return GetUserProfileDto.fromSource(userProfileSource);
  }

  @Get('address/:publicAddress')
  @ApiOperation({
    description: 'Get the metadata of a user profile given an address',
    summary: 'Public',
  })
  @ApiResponse({
    status: 202,
    description: 'User profile returned',
    type: GetUserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @Public()
  async getUserProfileByAddress(@Param('publicAddress') publicAddress: string): Promise<GetUserProfileDto> {
    const userProfileSource = await this.userProfileService.findOneByAddress(publicAddress);

    if (!userProfileSource) {
      throw new NotFoundException(`User profile with public address ${publicAddress} does not exist`);
    }

    return GetUserProfileDto.fromSource(userProfileSource);
  }

  @Put(':userId')
  @UseGuards(UserMatchId.fromParam('userId', [AuthRoles.Admin]))
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Update the user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a updated user profile',
    type: GetUserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateUserProfileByUserId(
    @Param('userId') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ): Promise<GetUserProfileDto> {
    const userProfileSource = await this.userProfileService.updateOneByEntryId(
      userId,
      UpdateUserProfileDto.fromPayload(updateUserProfileDto)
    );

    return GetUserProfileDto.fromSource(userProfileSource);
  }

  @Delete(':userId')
  @UseGuards(UserMatchId.fromParam('userId', [AuthRoles.Admin]))
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Disable the user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile disabled',
    type: DisableUserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async disableUserProfileByUserId(@Param('userId') userId: string): Promise<DisableUserProfileDto> {
    return this.userProfileService.disableOneByEntryId(userId);
  }
}
