import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsEmail,
  IsDate,
  IsBoolean,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { PaymentMethodsAccepted, State } from '../../common/type'
import { AdditionalInformation } from './additional-information.dto'
import { SearchHit } from '@elastic/elasticsearch/lib/api/types'
import { UserProfile } from '../user-profile.entity'
import { Stripe } from '../user-profile.interface'
import { StripeDto } from './stripe.dto'

export class GetUserProfileDto {
  static fromSource(userProfileSource: SearchHit<UserProfile>): GetUserProfileDto {
    return new GetUserProfileDto(
      userProfileSource._source.userId,
      userProfileSource._source.isListed,
      userProfileSource._source.state,
      userProfileSource._source.addresses,
      userProfileSource._source.nickname,
      userProfileSource._source.name,
      userProfileSource._source.email,
      userProfileSource._source.creationDate,
      userProfileSource._source.updateDate,
      userProfileSource._source.additionalInformation,
      userProfileSource._source.isPublisherEnabled,
      userProfileSource._source.paymentMethodsAccepted,
      userProfileSource._source.stripe,
    )
  }

  @ApiProperty({
    example: 'jifdwqejidqwa9okdasodkaso',
    description: 'Unique identifier of the user',
  })
  @IsString()
  userId: string

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
  })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsOptional()
  @IsEmail()
  email: string

  @ApiProperty({
    example: '2019-01-01T19:73:24Z',
    description: 'When the user information was created',
  })
  @IsDate()
  creationDate: Date

  @ApiProperty({
    example: '2019-01-01T19:73:24Z',
    description: 'When was the last time the user information was updated',
  })
  @IsDate()
  updateDate: Date

  @ApiProperty({
    example: AdditionalInformation,
    description: 'List of additional key-value attributes with additional information',
  })
  @ValidateNested()
  @Type(() => AdditionalInformation)
  additionalInformation: AdditionalInformation

  @ApiProperty({
    example: true,
    description:
      'Flag identifying if the user is enabled to publish content in the marketplace. Possible values: true or false',
  })
  @IsBoolean()
  isPublisherEnabled: boolean

  @ApiProperty({
    example: PaymentMethodsAccepted,
    description: 'Payment methods accepted by the user',
  })
  @IsEnum(PaymentMethodsAccepted)
  paymentMethodsAccepted: PaymentMethodsAccepted

  @ApiProperty({
    example: StripeDto,
    description: 'Stripe account information',
  })
  @ValidateNested()
  @Type(() => StripeDto)
  stripe: Stripe

  constructor(
    userId: string,
    isListed: boolean,
    state: State,
    addresses: string[],
    nickname: string,
    name: string,
    email: string,
    creationDate: Date,
    updateDate: Date,
    additionalInformation: AdditionalInformation,
    isPublisherEnabled: boolean,
    paymentMethodsAccepted: PaymentMethodsAccepted,
    stripe: Stripe,
  ) {
    this.userId = userId
    this.isListed = isListed
    this.state = state
    this.addresses = addresses
    this.nickname = nickname
    this.name = name
    this.email = email
    this.creationDate = creationDate
    this.updateDate = updateDate
    this.additionalInformation = additionalInformation
    this.isPublisherEnabled = isPublisherEnabled
    this.paymentMethodsAccepted = paymentMethodsAccepted
    this.stripe = stripe
  }
}
