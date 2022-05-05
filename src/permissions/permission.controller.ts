import { Post, Controller, Body, Get, Put, Delete, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { GetPermissionDto } from './dto/get-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Roles } from '../common/decorators/roles.decorators';
import { AuthRoles, PermissionType } from '../common/type';
import { Public } from '../common/decorators/auth.decorator';
import { SearchQueryDto } from '../common/helpers/search-query.dto';
import { SearchResponse } from '../common/helpers/search-response.dto';

@ApiTags('Permission')
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
  async getPermissionById(@Param('id') id: string): Promise<GetPermissionDto> {
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
    const permissionSources = await this.permissionService.findManyByUserIdAndType(userId, undefined, searchQueryDto);

    return SearchResponse.fromSearchSources(
      searchQueryDto,
      permissionSources,
      permissionSources.hits.map(GetPermissionDto.fromSource)
    );
  }

  @Get('user/:userId/:type')
  @ApiOperation({
    description: 'Get permissions by userId and type',
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
  async getPermissionByUserIdAndType(
    @Param('userId') userId: string,
    @Param('type') type: PermissionType,
    @Query() searchQueryDto: SearchQueryDto
  ): Promise<SearchResponse<GetPermissionDto[]>> {
    const permissionSources = await this.permissionService.findManyByUserIdAndType(userId, type, searchQueryDto);

    return SearchResponse.fromSearchSources(
      searchQueryDto,
      permissionSources,
      permissionSources.hits.map(GetPermissionDto.fromSource)
    );
  }

  @Put(':id')
  @Roles(AuthRoles.Admin)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Update the user profile',
    summary: 'Admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a updated permission',
    type: GetPermissionDto,
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
  async updatePermissionById(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ): Promise<GetPermissionDto> {
    const permissionSource = await this.permissionService.updateOneByEntryId(id, updatePermissionDto);

    return GetPermissionDto.fromSource(permissionSource);
  }

  @Delete(':id')
  @Roles(AuthRoles.Admin)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    description: 'Delete a permission',
    summary: 'Admin',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  async deletePermissionById(@Param('id') id: string): Promise<void> {
    await this.permissionService.deleteOneByEntryId(id);
  }
}
