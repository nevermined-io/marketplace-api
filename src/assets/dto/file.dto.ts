import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class FileDto {
    @ApiProperty({
        example: "zip",
        description: 'Compression file type',
    })
    @IsInt()
    compression: string;

    @ApiProperty({
        example: "4535431",
        description: 'Length of the content',
    })
    @IsString()
    contentLength: string;

    @ApiProperty({
        example: 'text/csv',
        description: 'File type',
    })
    @IsString()
    contentType: string;

    @ApiProperty({
        example: 'UTF-8',
        description: 'File type',
    })
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
        description: 'Resource id',
    })
    @IsString()
    resourceId: string;
}