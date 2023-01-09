import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsOptional, ValidateNested } from 'class-validator'
import { NvmConfigVersionsDto } from './nvmConfigVersions.dto'

export class NvmConfigDto {
  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the asset',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId: string

  @ApiProperty({
    example: '12345',
    description: 'The application id that created the asset',
    required: false,
  })
  @IsOptional()
  @IsString()
  appId: string

  @ApiProperty({
    example: '12345',
    description: 'The application id that created the asset',
    required: false,
    type: [NvmConfigVersionsDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NvmConfigVersionsDto)
  versions: NvmConfigVersionsDto[]
}
