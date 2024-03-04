import { ApiProperty } from '@nestjs/swagger'
import { IsString, ValidateNested } from 'class-validator'
import { AdditionalInformation } from './additional-information.dto'
import { Type } from 'class-transformer'

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

  @ApiProperty({
    example: AdditionalInformation,
    description: 'List of additional key-value attributes with additional information',
  })
  @ValidateNested()
  @Type(() => AdditionalInformation)
  additionalInformation: AdditionalInformation
}
