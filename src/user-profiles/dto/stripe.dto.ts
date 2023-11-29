import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class StripeDto {
  @ApiProperty({
    description: 'Stripe account id',
    required: false,
  })
  @IsString()
  accountId: string

  @ApiProperty({
    description: 'Flag identifying if the account is validated',
    required: false,
  })
  @IsBoolean()
  isAccountValidated: boolean

  @ApiProperty({
    description: 'Date of creation of the stripe account',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  accountCreatedAt: string

  @ApiProperty({
    description: 'Date of last update of the stripe account',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  accountUpdatedAt: string

  @ApiProperty({
    description: 'Aditional information of the stripe account',
    required: false,
  })
  @IsOptional()
  additionalInformation: unknown
}
