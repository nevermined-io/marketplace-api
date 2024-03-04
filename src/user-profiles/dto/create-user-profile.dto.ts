import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsBoolean, IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { State } from '../../common/type'
import { AdditionalInformation } from './additional-information.dto'

export class CreateUserProfileDto {
  @ApiProperty({
    example: true,
    description:
      'Flag identifying if the user is listed in the marketplace. Possible values: true or false',
  })
  @IsBoolean()
  isListed: boolean

  @ApiProperty({
    example: State.Confirmed,
    description:
      'State of the user in the marketplace. Possible options: disabled, unconfirmed, confirmed',
  })
  @IsEnum(State)
  state: State

  @ApiProperty({
    example: ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'],
    description:
      'The list of the addressed owned by the user. Addresses cannot be shared between different users',
  })
  @IsString({
    each: true,
  })
  addresses: string[]

  @ApiProperty({
    example: 'john.doe',
    description: 'The nickname of the user',
  })
  @IsString()
  nickname: string

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email: string

  @ApiProperty({
    example: AdditionalInformation,
    description: 'List of additional key-value attributes with additional information',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdditionalInformation)
  additionalInformation: AdditionalInformation
}
