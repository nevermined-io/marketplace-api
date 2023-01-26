import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsDate } from 'class-validator'
import { SearchHit } from '@elastic/elasticsearch/api/types'
import { Bookmark } from '../bookmark.entity'

export class GetBookmarkDto {
  static fromSource(bookmarkSource: SearchHit<Bookmark>): GetBookmarkDto {
    return new GetBookmarkDto(
      bookmarkSource._source.id,
      bookmarkSource._source.did,
      bookmarkSource._source.userId,
      bookmarkSource._source.description,
      bookmarkSource._source.createdAt,
    )
  }

  @ApiProperty({
    example: 'b-123434',
    description: 'The identifier of the bookmark',
  })
  @IsString()
  id: string

  @ApiProperty({
    example: 'did:12345',
    description: 'The identifier of the asset',
  })
  @IsString()
  did: string

  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the bookmark',
  })
  @IsString()
  userId: string

  @ApiProperty({
    example: 'I am interesting in this asset',
    description: 'Description given by the user',
  })
  @IsString()
  description: string

  @ApiProperty({
    example: new Date(),
    description: 'When the UGC was created',
  })
  @IsDate()
  createdAt: Date

  constructor(id: string, did: string, userId: string, description: string, createdAt: Date) {
    this.id = id
    this.did = did
    this.userId = userId
    this.description = description
    this.createdAt = createdAt
  }
}
