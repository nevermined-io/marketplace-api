import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsUrl, IsOptional } from 'class-validator';

export class FileDto {
  @ApiProperty({
    example: 'efb2c764274b745f5fc37f97c6b0e761',
    description:
      'Checksum of the file using your preferred format (i.e. MD5). Format specified in checksumType.' +
      "If it's not provided can't be validated if the file was not modified after registering",
  })
  @IsOptional()
  @IsString()
  checksum: string;

  @ApiProperty({
    example:
      'https://raw.githubusercontent.com/tbertinmahieux' +
      '/MSongsDB/master/Tasks_Demos/CoverSongs/shs_dataset_test.txt',
    description: 'Content URL. Omitted from the remote metadata. Supports http(s):// and ipfs:// URLs',
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  url: string;

  @ApiProperty({
    example: 'md5',
    description: 'Format of the provided checksum. Can vary according to server (i.e Amazon vs. Azure)',
  })
  @IsOptional()
  @IsString()
  checksumType: string;

  @ApiProperty({
    example: 'data.txt',
    description: 'File name',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'zip',
    description: 'File compression (e.g. no, gzip, bzip2, etc)',
  })
  @IsOptional()
  @IsString()
  compression: string;

  @ApiProperty({
    example: '4535431',
    description: 'Size of the file in bytes',
  })
  @IsOptional()
  @IsString()
  contentLength: string;

  @ApiProperty({
    example: 'text/csv',
    description: 'File format',
  })
  @IsString()
  contentType: string;

  @ApiProperty({
    example: 'UTF-8',
    description: 'File encoding (e.g. UTF-8)',
  })
  @IsOptional()
  @IsString()
  encoding: string;

  @ApiProperty({
    example: 0,
    description: 'Index of the file',
  })
  @IsInt()
  index: number;

  @ApiProperty({
    example: 'access-log2018-02-13-15-17-29-18386C502CAEA932',
    description:
      'Remote identifier of the file in the external provider' +
      '. It is typically the remote id in the cloud provider',
  })
  @IsOptional()
  @IsString()
  resourceId: string;

  @ApiProperty({
    example: false,
    description: 'Boolean. Is the file encrypted? If is not set is assumed the file is not encrypted',
  })
  @IsOptional()
  @IsString()
  encrypted: boolean;

  @ApiProperty({
    example: 'gpg',
    description: 'Encryption mode used. Just valid if encrypted=true',
  })
  @IsOptional()
  @IsString()
  encryptionMode: string;
}
