import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AditionalInformationDto } from './aditionalInformation.dto';
import { CurationDto } from './curation.dto';
import { MainDto } from './main.dto';

export class AttributesDto {
  @ApiProperty({
    type: AditionalInformationDto,
    description: 'Aditional information of the asset',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AditionalInformationDto)
  additionalInformation: AditionalInformationDto;

  @ApiProperty({
    type: CurationDto,
    description: 'popularity of the asset',
  })
  @ValidateNested()
  @Type(() => CurationDto)
  curation: CurationDto;

  @ApiProperty({
    type: MainDto,
    description: 'Main data of the asset',
  })
  @ValidateNested()
  @Type(() => MainDto)
  main: MainDto;
}
