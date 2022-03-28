import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { faker } from '@faker-js/faker';
import { Sort } from './search-query.interface';

export class SearchQueryDto {
  @ApiProperty({
    example: '{"match_all": {}}',
    description: 'execute directly queries to elasticsearch from the client',
    required: false,
    type: 'string',
  })
  @Transform(({ value }) => JSON.parse(value as string) as { [jsonPath: string]: any })
  @IsOptional()
  @ValidateNested()
  query?: { [jsonPath: string]: any };

  @ApiProperty({
    example: faker.lorem.sentence(),
    description: 'Text to search',
    required: false,
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({
    example: 100,
    description: 'Page Size',
    required: false,
    type: 'string',
  })
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsOptional()
  @IsNumber()
  offset = 100;

  @ApiProperty({
    example: 0,
    description: 'Page to retrieve',
    required: false,
    type: 'string',
  })
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsOptional()
  @IsNumber()
  page = 0;

  @ApiProperty({
    example: '{ "createdAt": "asc" }',
    description: 'sort the response by specified parameter',
    required: false,
    type: 'string',
  })
  @Transform(({ value }) => JSON.parse(value as string) as Sort)
  @IsOptional()
  @ValidateNested()
  sort?: Sort;
}
