import { SearchHit } from '@elastic/elasticsearch/api/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { InternalDto } from './internal.dto'
import { Internal } from '../asset.interface'
import { DDOStatus } from '../ddo-status.entity'

export class GetDDOStatusDto {
  static fromSource(ddoStatusSource: SearchHit<DDOStatus>): GetDDOStatusDto {
    return new GetDDOStatusDto(
      ddoStatusSource._source.did,
      ddoStatusSource._source.internal,
      ddoStatusSource._source.external
    )
  }

  @ApiProperty({
    example: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e429',
    description: 'Id of the asset',
  })
  @IsString()
  did: string

  @ApiProperty({
    type: InternalDto,
    description: 'Info of the status of the DDO',
  })
  @ValidateNested()
  @Type(() => InternalDto)
  internal: Internal

  @ApiProperty({
    example: null,
    description: 'Data from external source',
  })
  external: unknown

  constructor(did: string, internal: Internal, external: unknown) {
    this.did = did
    this.internal = internal
    this.external = external
  }
}
