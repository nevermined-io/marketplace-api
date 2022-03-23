import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttributesDto } from './attributes.dto';
import { ServiceDto } from './service.dto';

export class MetadataDto extends ServiceDto {
  @ApiProperty({
    type: [AttributesDto],
    description: 'Attribute of the metadata',
  })
  @ValidateNested()
  @Type(() => AttributesDto)
  attributes: AttributesDto;
}
