import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsInt, IsUrl, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { AttributesDto } from './attributes.dto'

export class ServiceDto {
  @ApiProperty({
    example: 0,
    description: 'index of the service',
  })
  @IsInt()
  index: number

  @ApiProperty({
    example: 'http://localhost:8030/api/v1/gateway/services/consume',
    description: 'Url of the service endpoint',
  })
  @IsUrl({
    require_tld: false,
  })
  serviceEndpoint: string

  @ApiProperty({
    example: 'access',
    description: 'Service type',
  })
  @IsString()
  type: string

  @ApiProperty({
    example: 'SecretStore',
    description: 'Service name',
    required: false,
  })
  @IsOptional()
  @IsString()
  service: string

  @ApiProperty({
    example: 'http://localhost:8030/api/v1/gateway/services/access/initialize',
    description: 'Url to purchase asset',
    required: false,
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  purchaseEndpoint: string

  @ApiProperty({
    type: AttributesDto,
    description: 'Attribute of the metadata',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AttributesDto)
  attributes: AttributesDto
}
