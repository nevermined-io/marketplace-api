import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class UpdateBookmarkDto {
  @ApiProperty({
    example: 'I am interesting in this asset',
    description: 'Description given by the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string

  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the bookmark',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId: string
}
