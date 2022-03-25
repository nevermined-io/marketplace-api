import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { FileDto } from './file.dto';
import { AlgorithmDto } from './algorithm.dto';

export class MainDto {
  @ApiProperty({
    example: 'Met Office',
    description: 'Name of the entity generating this data (e.g. Tfl, Disney Corp, etc.)',
  })
  @IsString()
  author: string;

  @ApiProperty({
    example: '2021-02-01T10:55:11Z',
    description:
      'The date on which the asset was created by the originator.' +
      'ISO 8601 format, Coordinated Universal Time, e.g. 2019-01-31T08:38:32Z',
  })
  @IsDateString()
  dateCreated: string;

  @ApiProperty({
    example: '2021-02-01T10:55:11Z',
    description: 'The date on which the asset DDO is registered into the metadata store',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  datePublished: string;

  @ApiProperty({
    example: '0x098213xzckasdf089723hjgdasfkjgasfv',
    description: 'files encrytion signature',
  })
  @IsString()
  encryptedFiles: string;

  @ApiProperty({
    type: [FileDto],
    description: 'Array of File objects including the encrypted file urls. Further metadata about each file is stored',
  })
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files: FileDto[];

  @ApiProperty({
    example: 'CC-BY',
    description:
      'Short name referencing the license of the asset (e.g. Public Domain, CC-0, CC-BY, ' +
      'No License Specified, etc.). If it\'s not specified, the following value will be added: "No License Specified',
  })
  @IsString()
  license: number;

  @ApiProperty({
    example: 'UK Weather information 2011',
    description: 'Descriptive name or title of the asset',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '10',
    description: 'Price of the asset. It must be an integer encoded as a string, e.g. "123000000000000000000"',
  })
  @IsString()
  price: string;

  @ApiProperty({
    example: 'dataset',
    description:
      'Type of the asset. Helps to filter by the type of asset. It could be for example ("dataset", "algorithm")',
  })
  @IsString()
  type: string;

  @ApiProperty({
    type: AlgorithmDto,
    description: 'Algorithm used in the asset',
  })
  @ValidateNested()
  @Type(() => AlgorithmDto)
  algorithm: AlgorithmDto;
}
