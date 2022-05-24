import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsUrl, IsDateString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthenticationDto } from './authentication.dto';
import { ProofDto } from './proof.dto';
import { PublicKeyDto } from './publicKey.dto';
import { ServiceDto } from './service.dto';
import { serviceExample } from './service.example';

export class CreateAssetDto {
  @ApiProperty({
    example: 'https://w3id.org/did/v1',
    description: 'Context of the asset',
    name: '@context',
  })
  @IsUrl({
    require_tld: false,
  })
  ['@context']: string;

  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the asset',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e429',
    description: 'ID of the asset',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '2019-02-08T08:13:49Z',
    description: 'ID of the asset',
    required: false,
  })
  @IsDateString()
  created: string;

  @ApiProperty({
    example: '2019-02-08T08:13:49Z',
    description: 'ID of the asset',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  updated: string;

  @ApiProperty({
    description: 'Authentication used in the asset',
    type: [AuthenticationDto],
  })
  @ValidateNested({ each: true })
  @Type(() => AuthenticationDto)
  authentication: AuthenticationDto[];

  @ApiProperty({
    type: ProofDto,
    description: 'Proof data',
  })
  @ValidateNested()
  proof: ProofDto;

  @ApiProperty({
    type: [PublicKeyDto],
    description: 'Public keys that contains the asset',
  })
  @ValidateNested({ each: true })
  @Type(() => PublicKeyDto)
  publicKey: PublicKeyDto[];

  @ApiProperty({
    example: serviceExample,
    description: 'Services that contains the asset',
    isArray: true,
    type: ServiceDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  service: ServiceDto[];
}
