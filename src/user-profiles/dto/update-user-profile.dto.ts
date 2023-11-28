import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsDate,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { PaymentMethodsAccepted, State } from '../../common/type'
import { AdditionalInformation } from './additional-information.dto'
import { StripeDto } from './stripe.dto'
import { Stripe } from '../user-profile.interface'

export class UpdateUserProfileDto {
  static fromPayload(userProfile: UpdateUserProfileDto): UpdateUserProfileDto {
    return new UpdateUserProfileDto(
      userProfile.isListed,
      userProfile.state,
      userProfile.addresses,
      userProfile.nickname,
      userProfile.name,
      userProfile.email,
      new Date(),
      userProfile.additionalInformation,
      userProfile.isPublisherEnabled,
      userProfile.paymentMethodsAccepted,
      userProfile.stripe,
    )
  }

  @ApiProperty({
    example: true,
    description:
      'Flag identifying if the user is listed in the marketplace. Possible values: true or false',
  })
  @IsOptional()
  @IsBoolean()
  isListed: boolean

  @ApiProperty({
    example: State.Confirmed,
    description:
      'State of the user in the marketplace. Possible options: disabled, unconfirmed, confirmed',
  })
  @IsOptional()
  @IsEnum(State)
  state: State

  @ApiProperty({
    example: ['0x37BB53e3d293494DE59fBe1FF78500423dcFd43B'],
    description:
      'The list of the addressed owned by the user. Addresses cannot be shared between different users',
  })
  @IsOptional()
  @IsString({
    each: true,
  })
  addresses: string[]

  @ApiProperty({
    example: 'john.doe',
    description: 'The nickname of the user',
  })
  @IsOptional()
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
    example: AdditionalInformation,
    description: 'List of additional key-value attributes with additional information',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdditionalInformation)
  additionalInformation: AdditionalInformation

  @ApiProperty({
    example: '2019-01-01T19:73:24Z',
    description: 'When was the last time the user information was updated',
  })
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @IsDate()
  updateDate: Date

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
    isListed: boolean,
    state: State,
    addresses: string[],
    nickname: string,
    name: string,
    email: string,
    updateDate: Date,
    additionalInformation: AdditionalInformation,
    isPublisherEnabled: boolean,
    paymentMethodsAccepted: PaymentMethodsAccepted,
    stripe: Stripe,
  ) {
    this.isListed = isListed
    this.state = state
    this.addresses = addresses
    this.nickname = nickname
    this.name = name
    this.email = email
    this.updateDate = updateDate
    this.additionalInformation = additionalInformation
    this.isPublisherEnabled = isPublisherEnabled
    this.paymentMethodsAccepted = paymentMethodsAccepted
    this.stripe = stripe
  }
}
