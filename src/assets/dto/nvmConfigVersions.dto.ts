import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDateString, IsNumber } from 'class-validator'

export class NvmConfigVersionsDto {
  @ApiProperty({
    example: '1',
    description: 'The id of the revision',
  })
  @IsNumber()
  id: number

  @ApiProperty({
    example: '2020-01-01T19:13:24Z',
    description: 'The date of the revision',
  })
  @IsDateString()
  updated: string

  @ApiProperty({
    example: '89328493849328493284932',
    description: 'The checksum of the revision',
  })
  @IsString()
  checksum: string
}
