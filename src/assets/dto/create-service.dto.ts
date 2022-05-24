import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUrl, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AttributesDto } from './attributes.dto';

export class CreateServiceDto {
  @ApiProperty({
    example: 'a-1233456',
    description: 'Agreement id',
  })
  @IsString()
  agreementId: string;

  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the service',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 0,
    description: 'index of the service',
  })
  @IsInt()
  index: number;

  @ApiProperty({
    example: 0,
    description: 'index of the service',
  })
  @IsString()
  templateId: string;

  @ApiProperty({
    example: 'http://localhost:8030/api/v1/gateway/services/consume',
    description: 'Url of the service endpoint',
  })
  @IsUrl({
    require_tld: false,
  })
  serviceEndpoint: string;

  @ApiProperty({
    example: 'access',
    description: 'Service type',
  })
  @IsString()
  type: string;

  @ApiProperty({
    type: AttributesDto,
    description: 'Attribute of the metadata',
    required: false,
  })
  @ValidateNested()
  @Type(() => AttributesDto)
  attributes: AttributesDto;
}
