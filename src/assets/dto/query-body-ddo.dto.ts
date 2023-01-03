import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { Sort } from '../../common/helpers/search-query.interface';

export class QueryBodyDDOdto {
  @ApiProperty({
    example: { match_all: {} },
    description: 'execute directly queries to elasticsearch from the client',
    required: false,
    type: 'object',
  })
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
    example: { created: 'asc' },
    description: 'sort the response by specified parameter',
    required: false,
    type: 'object',
  })
  @IsOptional()
  @ValidateNested()
  sort?: Sort;
}
