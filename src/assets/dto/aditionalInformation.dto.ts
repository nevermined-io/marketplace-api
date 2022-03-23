import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsLocale, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { LinkDto } from './link.dto';

export class AditionalInformationDto {
    @ApiProperty({
        example: 'Met Office',
        description: 'who hold the copyright',
    })
    @IsString()
    copyrightHolder: string;
    
    @ApiProperty({
        example: 'Weather information of UK including temperature and humidity',
        description: 'Description of the asset',
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: 'en',
        description: 'Language of the asset',
    })
    @IsLocale()
    inLanguage: string;

    @ApiProperty({
        example: [LinkDto],
        description: 'Links of the asset',
    })
    @ValidateNested({ each: true })
    @Type(() => LinkDto)
    links: LinkDto[];
    
    @ApiProperty({
        example: [
            'weather',
            'uk',
            '2011',
            'temperature',
            'humidity'
        ],
        description: 'Tags of the asset',
    })
    @IsArray()
    tags: string[];

    @ApiProperty({
        example: 'stationId,latitude,longitude,datetime, '+
            'temperature,humidity/n423432fsd,51.509865,-0.118092, 2011-01-01T10:55:11+00:00,7.2,68',
        description: 'Example how it works',
    })
    @IsString()
    workExample: string;
}