import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FileDto } from './file.dto';

export class MainDto {
    @ApiProperty({
        example: "Met Office",
        description: 'Author of the metadata',
    })
    @IsString()
    author: string;

    @ApiProperty({
        example: "2021-02-01T10:55:11Z",
        description: 'Date when the metadata is created',
    })
    @IsDateString()
    dateCreated: string;

    @ApiProperty({
        example: '0x098213xzckasdf089723hjgdasfkjgasfv',
        description: 'files encrytion signature',
    })
    @IsString()
    encryptedFiles: string;

    @ApiProperty({
        example: [FileDto],
        description: 'Files that contains the metadata',
    })
    @ValidateNested({ each: true })
    @Type(() => FileDto)
    files: FileDto[];

    @ApiProperty({
        example: 'CC-BY',
        description: 'License of the metadata',
    })
    @IsString()
    license: number;

    @ApiProperty({
        example: 'UK Weather information 2011',
        description: 'Name of the metadata',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: '10',
        description: 'Price of the metadata',
    })
    @IsString()
    price: string;

    @ApiProperty({
        example: 'dataset',
        description: 'Metadata type',
    })
    @IsString()
    type: string;
}