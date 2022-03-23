import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { AditionalInformationDto } from './aditionalInformation.dto';
import { CurationDto } from './curation.dto';
import { MainDto } from './main.dto';

export class AttributesDto {
  @ApiProperty({
    type: AditionalInformationDto,
    description: 'Aditional information of the asset',
  })
  @ValidateNested()
  additionalInformation: AditionalInformationDto;

  @ApiProperty({
    type: CurationDto,
    description: 'popularity of the asset',
  })
  @ValidateNested()
  curation: CurationDto;

  @ApiProperty({
    type: MainDto,
    description: 'Main data of the asset',
  })
  @ValidateNested()
  main: MainDto;
}
