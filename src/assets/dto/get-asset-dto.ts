import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsDateString, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthenticationDto } from './authentication.dto';
import { ProofDto } from './proof.dto';
import { PublicKeyDto } from './publicKey.dto';
import { serviceExample } from './service.example';
import { ServiceDto } from './service.dto';
import { SearchHit } from '@elastic/elasticsearch/api/types';
import { Asset } from '../asset.entity';

export class GetAssetDto {
  static fromSource(assetSource: SearchHit<Asset>): GetAssetDto {
    return new GetAssetDto(
      assetSource._source['@context'],
      assetSource._source.authentication,
      assetSource._source.userId,
      assetSource._source.created,
      assetSource._source.updated,
      assetSource._source.id,
      assetSource._source.proof,
      assetSource._source.publicKey,
      assetSource._source.service
    );
  }

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
    type: [AuthenticationDto],
    description: 'Authentication used in the asset',
  })
  @ValidateNested({ each: true })
  @Type(() => AuthenticationDto)
  authentication: AuthenticationDto[];

  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the asset',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '2021-02-01T10:55:11Z',
    description: 'Date when the asset is created',
  })
  @IsDateString()
  created: string;

  @ApiProperty({
    example: '2021-02-01T10:55:11Z',
    description: 'Date when the asset is created',
  })
  @IsDateString()
  updated: string;

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
    isArray: true,
    type: ServiceDto,
  })
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  service: ServiceDto[];

  constructor(
    context: string,
    authentication: AuthenticationDto[],
    userId: string,
    created: string,
    updated: string,
    id: string,
    proof: ProofDto,
    publicKey: PublicKeyDto[],
    service: ServiceDto[]
  ) {
    this['@context'] = context;
    this.authentication = authentication;
    this.userId = userId;
    this.created = created;
    this.updated = updated;
    this.id = id;
    this.proof = proof;
    this.publicKey = publicKey;
    this.service = service;
  }
}
