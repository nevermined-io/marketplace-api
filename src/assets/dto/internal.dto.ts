import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { SourceType, Status } from '../../common/type';

export class InternalDto {
  @ApiProperty({
    example: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e429',
    description: 'Id of the asset',
  })
  @IsString()
  id: string;
  @ApiProperty({
    example: SourceType.Elasticsearch,
    description: 'Where come from the sources',
  })
  @IsEnum(SourceType)
  type: SourceType;

  @ApiProperty({
    example: Status.Accepted,
    description: 'Status of the asset',
  })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({
    example:
      'http://localhost:3100/api/v1/metadata/assets/ddo/' +
      'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e429',
    description: 'Status of the asset',
  })
  url: string;
}
