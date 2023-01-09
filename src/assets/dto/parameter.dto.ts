import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ParameterDto {
  @ApiProperty({
    example: '_rewardAddress',
    description: 'Parameter name',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 'address',
    description: 'Parameter type',
  })
  @IsString()
  type: string

  @ApiProperty({
    example: '0x886dE2b3F8F27eEd43bA2FD4bC2AabDc14E0d9dD',
    description: 'Parameter value',
  })
  value: unknown
}
