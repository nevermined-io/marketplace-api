import { SearchHit } from '@elastic/elasticsearch/api/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttributesDto } from './attributes.dto';
import { Service } from '../ddo-service.entity';

export class GetServiceDto {
  static fromSource(serviceSource: SearchHit<Service>): GetServiceDto {
    return new GetServiceDto(
      serviceSource._source.agreementId,
      serviceSource._source.index,
      serviceSource._source.templateId,
      serviceSource._source.serviceEndpoint,
      serviceSource._source.type,
      serviceSource._source.attributes
    );
  }

  @ApiProperty({
    example: 'a-1233456',
    description: 'Agreement id',
  })
  @IsString()
  agreementId: string;

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

  constructor(
    agreementId: string,
    index: number,
    templateId: string,
    serviceEndpoint: string,
    type: string,
    attributes: AttributesDto
  ) {
    this.agreementId = agreementId;
    this.index = index;
    this.templateId = templateId;
    this.serviceEndpoint = serviceEndpoint;
    this.type = type;
    this.attributes = attributes;
  }
}
