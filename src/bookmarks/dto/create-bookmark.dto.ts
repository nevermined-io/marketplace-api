import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    example: 'did:12345',
    description: 'The identifier of the asset',
  })
  @IsString()
  did: string;

  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the bookmark',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({
    example: 'I am interesting in this asset',
    description: 'Description given by the user',
  })
  @IsString()
  description: string;
}
