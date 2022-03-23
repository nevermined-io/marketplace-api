import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class LinkDto {
    @ApiProperty({
        example: 'Sample of Asset Data',
        description: 'Name of the link',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'sample',
        description: 'Type of the link',
    })
    @IsString()
    type: string;

    @ApiProperty({
        example: 'https://foo.com/sample.csv',
        description: 'Url of the link',
    })
    @IsUrl()
    url: string;
}