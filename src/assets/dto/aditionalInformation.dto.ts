import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsLocale, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { LinkDto } from './link.dto';

export class AditionalInformationDto {
  @ApiProperty({
    example: 'Met Office',
    description: 'who hold the copyright',
    required: false,
  })
  @IsOptional()
  @IsString()
  copyrightHolder: string;

  @ApiProperty({
    example: 'Weather information of UK including temperature and humidity',
    description: 'Description of the asset',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'en',
    description: 'Language of the data',
    required: false,
  })
  @IsOptional()
  @IsLocale()
  inLanguage: string;

  @ApiProperty({
    type: [LinkDto],
    description: 'Links of the data',
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[];

  @ApiProperty({
    example: ['weather', 'uk', '2011', 'temperature', 'humidity'],
    description: 'Tags of the data',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    example: ['data', 'mainnet'],
    description: 'Category of the data',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    example:
      'stationId,latitude,longitude,datetime, ' +
      'temperature,humidity/n423432fsd,51.509865,-0.118092, 2011-01-01T10:55:11+00:00,7.2,68',
    description: 'Example how it works',
    required: false,
  })
  @IsOptional()
  @IsString()
  workExample: string;
}
