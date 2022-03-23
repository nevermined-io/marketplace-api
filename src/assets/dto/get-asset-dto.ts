import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthenticationDto } from './authentication.dto';
import { ProofDto } from './proof.dto';
import { PublicKeyDto } from './publicKey.dto';
import { AuthorizationDto } from './authorization.dto';
import { AccessDto } from './access.dto';
import { MetadataDto } from './metadata.dto';
import { serviceExample } from './service.example';

export class GetAssetDto {
  @ApiProperty({
    example: 'https://w3id.org/did/v1',
    description: 'Context of the asset',
    name: '@context',
  })
  @IsString()
  ['@context']: string;

  @ApiProperty({
    type: [AuthenticationDto],
    description: 'Authentication used in the asset',
  })
  @ValidateNested({ each: true })
  @Type(() => AuthenticationDto)
  authentication: AuthenticationDto[];

  @ApiProperty({
    example: '2021-02-01T10:55:11Z',
    description: 'Date when the asset is created',
  })
  @IsDate()
  created: Date;

  @ApiProperty({
    example: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e429',
    description: 'ID of the asset',
  })
  @IsString()
  id: string;

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
  })
  @ValidateNested({ each: true })
  @Type(() => AuthorizationDto || AccessDto || MetadataDto)
  service: (AuthorizationDto | AccessDto | MetadataDto)[];
}
