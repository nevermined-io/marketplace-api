import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventDto } from './event.dto';
import { ParameterDto } from './parameter.dto';

export class ConditionDto {
  @ApiProperty({
    example: 'LockPaymentCondition',
    description: 'Contract name',
  })
  @IsString()
  contractName: string;

  @ApiProperty({
    example: 'fulfill',
    description: 'Function name',
  })
  @IsString()
  functionName: string;

  @ApiProperty({
    example: 'lockPayment',
    description: 'Function name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: [EventDto],
    description: 'Events',
  })
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];

  @ApiProperty({
    type: [ParameterDto],
    description: 'Parameters',
  })
  @ValidateNested({ each: true })
  @Type(() => ParameterDto)
  parameters: ParameterDto[];

  @ApiProperty({
    example: 0,
    description: 'Time lock',
  })
  @IsInt()
  timelock: number;

  @ApiProperty({
    example: 0,
    description: 'Time out',
  })
  @IsInt()
  timeout: number;
}
