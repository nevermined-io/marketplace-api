import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RestrictedUserProfileDto {
  @ApiProperty({
    example: 'jifdwqejidqwa9okdasodkaso',
    description: 'Unique identifier of the user',
  })
  @IsString()
  userId: string

  @ApiProperty({
    example: 'john.doe',
    description: 'The nickname of the user',
  })
  @IsString()
  nickname: string
}
