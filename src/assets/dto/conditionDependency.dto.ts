import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ConditionDependencyDto {
  @ApiProperty({
    example: [],
    description: 'Access',
  })
  @IsArray()
  access: string[];

  @ApiProperty({
    example: ['lockPayment', 'access'],
    description: 'Escrow Payment',
  })
  @IsArray()
  escrowPayment: string[];

  @ApiProperty({
    example: [],
    description: 'Exec Compute',
  })
  @IsString({ each: true })
  execCompute: string[];

  @ApiProperty({
    example: [],
    description: 'Lock Payment',
  })
  @IsArray()
  lockPayment: string[];
}
