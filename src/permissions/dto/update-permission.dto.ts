import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PermissionType } from '../../common/type';

export class UpdatePermissionDto {
  @ApiProperty({
    example: [PermissionType.Read, PermissionType.Update, PermissionType.Delete],
    description: 'The list of permissions owned hold by the user',
  })
  @IsEnum(PermissionType, { each: true })
  type: PermissionType[];
}
