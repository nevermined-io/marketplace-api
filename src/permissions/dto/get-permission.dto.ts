import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { PermissionType } from '../../common/type';

export class GetPermissionDto {
  @ApiProperty({
    example: `pe-${uuidv4()}`,
    description: 'Unique identifier for the permissions entry',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'us-12345',
    description: 'The userId who created the bookmark',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: [PermissionType.Read, PermissionType.Update, PermissionType.Delete],
    description: 'The list of permissions owned hold by the user',
  })
  @IsString()
  type: PermissionType[];

  @ApiProperty({
    example: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12',
    description: 'The account providing the permissions',
  })
  @IsString()
  issuer: string;

  @ApiProperty({
    example: '0x37BB53e3d293494DE59fBe1FF78500423dcFd43B',
    description: 'The public address holding the permissions',
  })
  @IsString()
  holder: string;

  @ApiProperty({
    example: '2019-01-01T19:73:24Z',
    description: 'When the permissions entry was created',
  })
  issuanceDate: Date;
}
