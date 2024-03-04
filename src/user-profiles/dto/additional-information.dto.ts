import { ApiProperty } from '@nestjs/swagger'
import { IsUrl, IsOptional, IsBoolean, IsEnum, ValidateNested } from 'class-validator'
import { PaymentMethodsAccepted } from 'src/common/type'
import { Stripe } from '../user-profile.interface'
import { Type } from 'class-transformer'
import { StripeDto } from './stripe.dto'

export class AdditionalInformation {
  @ApiProperty({
    example: 'http://example.com/avatar.jpg',
    description: 'Profile image url',
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  profilePicture: string

  @ApiProperty({
    example: 'http://linkedin.com',
    description: 'User Linkedin profile url',
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  linkedinProfile: string

  @ApiProperty({
    example: true,
    description:
      'Flag identifying if the user is enabled to publish content in the marketplace. Possible values: true or false',
  })
  @IsBoolean()
  @IsOptional()
  isPublisherEnabled: boolean

  @ApiProperty({
    example: PaymentMethodsAccepted,
    description: 'Payment methods accepted by the user',
  })
  @IsOptional()
  @IsEnum(PaymentMethodsAccepted)
  paymentMethodsAccepted: PaymentMethodsAccepted

  @ApiProperty({
    example: StripeDto,
    description: 'Stripe account information',
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => StripeDto)
  stripe: Stripe
}
