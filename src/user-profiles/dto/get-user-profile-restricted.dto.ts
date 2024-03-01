import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class RestrictedUserProfileDto {
  @ApiProperty({
    example: 'jifdwqejidqwa9okdasodkaso',
    description: 'Unique identifier of the user',
  })
  @IsString()
  userId: string

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsOptional()
  @IsString()
  name: string
}
