import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class ConditionDependencyDto {
  @ApiProperty({
    example: [],
    description: 'Access',
  })
  @IsOptional()
  @IsArray()
  access: string[];

  @ApiProperty({
    example: ['lockPayment', 'access'],
    description: 'Escrow Payment',
  })
  @IsOptional()
  @IsArray()
  escrowPayment: string[];

  @ApiProperty({
    example: [],
    description: 'Exec Compute',
  })
  @IsOptional()
  @IsString({ each: true })
  execCompute: string[];

  @ApiProperty({
    example: [],
    description: 'Lock Payment',
  })
  @IsArray()
  lockPayment: string[];
}
