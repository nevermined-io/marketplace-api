import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class ConditionDependencyDto {
  @ApiProperty({
    example: [],
    description: 'Access',
    required: false,
  })
  @IsOptional()
  @IsArray()
  access: string[];

  @ApiProperty({
    example: ['lockPayment', 'access'],
    description: 'Escrow Payment',
    required: false,
  })
  @IsOptional()
  @IsArray()
  escrowPayment: string[];

  @ApiProperty({
    example: [],
    description: 'Exec Compute',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  execCompute: string[];

  @ApiProperty({
    example: [],
    description: 'Lock Payment',
    required: false,
  })
  @IsArray()
  @IsOptional()
  lockPayment: string[];
}
