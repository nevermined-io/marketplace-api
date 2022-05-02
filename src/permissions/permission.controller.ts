import { Post, Controller, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { GetPermissionDto } from './dto/get-permission.dto';
import { Roles } from '../common/decorators/roles.decorators';
import { AuthRoles } from '../common/type';

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
    status: 403,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto): Promise<GetPermissionDto> {
    return this.permissionService.createOne(createPermissionDto);
  }
}
