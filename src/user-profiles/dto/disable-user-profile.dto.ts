import { ApiProperty } from '@nestjs/swagger'
import { GetUserProfileDto } from './get-user-profile.dto'
import { IsEnum } from 'class-validator'
import { State } from '../../common/type'

export class DisableUserProfileDto extends GetUserProfileDto {
  @ApiProperty({
    example: State.Disabled,
    description: 'State of the user in the marketplace. Possible options: disabled, unconfirmed, confirmed',
  })
  @IsEnum(State)
  state: State
}
