import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { faker } from '@faker-js/faker';
import { Sort } from './search-query.interface';

export class SearchQueryDto {
    @ApiProperty({
        example: {'match_all': {}},
        description: 'execute directly queries to elasticsearch from the client',
    })
    @IsObject()
    @IsOptional()
    query?: { [jsonPath: string]: any };

    @ApiProperty({
        example: faker.lorem.sentence(),
        description: 'Text to search'
    })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiProperty({
        example: 100,
        description: 'Page Size'
    })
    @IsOptional()
    @IsNumber()
    offset = 100;

    @ApiProperty({
        example: 0,
        description: 'Page to retrieve'
    })
    @IsOptional()
    @IsNumber()
    page = 0;

    @ApiProperty({
        example: { created: -1 },
        description: 'sort the response by specified parameter'
    })
    @IsOptional()
    @ValidateNested()
    sort?: Sort;
}