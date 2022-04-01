import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { HandlerDto } from './handler.dto';

export class EventDto {
  @ApiProperty({
    example: 'publisher',
    description: 'Action Type',
  })
  @IsOptional()
  @IsString()
  actionType: string;

  @ApiProperty({
    example: HandlerDto,
    description: 'Handler event',
  })
  @ValidateNested()
  @Type(() => HandlerDto)
  handler: HandlerDto;

  @ApiProperty({
    example: 'Fulfilled',
    description: 'Name of the event',
  })
  @IsString()
  name: string;
}
