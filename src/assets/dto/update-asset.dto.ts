import { ApiProperty } from '@nestjs/swagger'
import { ValidateNested, IsUrl, IsDateString, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { AuthenticationDto } from './authentication.dto'
import { ProofDto } from './proof.dto'
import { PublicKeyDto } from './publicKey.dto'
import { ServiceDto } from './service.dto'
import { serviceExample } from './service.example'

export class UpdateAssetDto {
  @ApiProperty({
    example: 'https://w3id.org/did/v1',
    description: 'Context of the asset',
    name: '@context',
  })
  @IsOptional()
  @IsUrl({
    require_tld: false,
  })
  ['@context']: string

  @ApiProperty({
    example: '2019-02-08T08:13:49Z',
    description: 'ID of the asset',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updated: string

  @ApiProperty({
    description: 'Authentication used in the asset',
    type: [AuthenticationDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AuthenticationDto)
  authentication: AuthenticationDto[]

  @ApiProperty({
    type: ProofDto,
    description: 'Proof data',
  })
  @IsOptional()
  @ValidateNested()
  proof: ProofDto

  @ApiProperty({
    type: [PublicKeyDto],
    description: 'Public keys that contains the asset',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PublicKeyDto)
  publicKey: PublicKeyDto[]

  @ApiProperty({
    example: serviceExample,
    description: 'Services that contains the asset',
    isArray: true,
    type: ServiceDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  service: ServiceDto[]
}
