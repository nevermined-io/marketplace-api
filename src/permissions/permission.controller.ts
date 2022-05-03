import { Post, Controller, Body, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { GetPermissionDto } from './dto/get-permission.dto';
import { Roles } from '../common/decorators/roles.decorators';
import { AuthRoles } from '../common/type';
import { Public } from '../common/decorators/auth.decorator';

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
}
