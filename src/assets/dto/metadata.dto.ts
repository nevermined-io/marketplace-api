import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { AttributesDto } from './attributes.dto';

export class MetamadataDto {
    @ApiProperty({
        example: [AttributesDto],
        description: 'Attribute of the metadata',
    })
    @ValidateNested()
    attributes: AttributesDto;
}