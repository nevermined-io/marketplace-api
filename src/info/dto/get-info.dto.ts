import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class GetInfoDto {
  @ApiProperty({
    example: '7.17',
    description: 'Elasticsearch version',
  })
  @IsString()
  elasticsearchVersion: string;

  @ApiProperty({
    example: '1.0.4',
    description: 'Matching API Version',
  })
  @IsString()
  APIversion: string;

  @ApiProperty({
    example: '1.0.4',
    description: 'Matching API Version',
  })
  @IsUrl({
    require_tld: false,
  })
  docs: string;
}
