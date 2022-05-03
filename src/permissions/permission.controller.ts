import { Post, Controller, Body, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { GetPermissionDto } from './dto/get-permission.dto';
import { Roles } from '../common/decorators/roles.decorators';
import { AuthRoles } from '../common/type';
import { Public } from '../common/decorators/auth.decorator';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchResponse } from '../common/helpers/search-response.dto';

@ApiTags('User Profile')
@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles(AuthRoles.Admin)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Create a permission entry',
    summary: 'Admin',
  })
  @ApiResponse({
    status: 201,
    description: 'Permission is created',
    type: GetPermissionDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto): Promise<GetPermissionDto> {
    return this.permissionService.createOne(createPermissionDto);
  }

  @Get(':id')
  @ApiOperation({
    description: 'Get permission by Id',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission is returned',
    type: GetPermissionDto,
  })
  @Public()
  async getPermissionById(@Param() id: string): Promise<GetPermissionDto> {
    const permissionSource = await this.permissionService.findOneById(id);

    return GetPermissionDto.fromSource(permissionSource);
  }

  @Get('user/:userId')
  @ApiOperation({
    description: 'Get permissions by userId',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions are returned',
    schema: SearchResponse.toDocs(GetPermissionDto),
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Public()
  async getPermissionByUserId(
    @Param('userId') userId: string,
    @Query() searchQueryDto: SearchQueryDto
  ): Promise<SearchResponse<GetPermissionDto[]>> {
    const permissionSources = await this.permissionService.findManyByUserId(userId, searchQueryDto);

    return SearchResponse.fromSearchSources(
      searchQueryDto,
      permissionSources,
      permissionSources.hits.map(GetPermissionDto.fromSource)
    );
  }
}
