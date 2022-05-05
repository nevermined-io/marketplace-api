import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PermissionType } from '../../common/type';

export class UpdatePermissionDto {
  @ApiProperty({
    example: [PermissionType.Read, PermissionType.Update, PermissionType.Delete],
    description: 'The list of permissions owned hold by the user',
  })
  @IsString()
  type: PermissionType[];
}
