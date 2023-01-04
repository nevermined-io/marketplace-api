import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
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
    example: 1,
    description: 'Page to retrieve',
    required: false,
    type: 'string',
  })
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsOptional()
  @IsNumber()
  page = 1;

  @ApiProperty({
    example: '{ "id": "asc" }',
    description: 'sort the response by specified parameter',
    required: false,
    type: 'string',
  })
  @Transform(({ value }) => JSON.parse(value as string) as Sort)
  @IsOptional()
  @ValidateNested()
  sort?: Sort;
}
