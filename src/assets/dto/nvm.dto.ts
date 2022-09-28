import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { NvmVersionsDto } from './nvm-versions.dto';

export class NvmDto {
  @ApiProperty({
    example: 'u-12345',
    description: 'The userId who created the asset',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({
    example: '12345',
    description: 'The application id that created the asset',
    required: false,
  })
  @IsOptional()
  @IsString()
  appId: string;

  @ApiProperty({
    example: '12345',
    description: 'The application id that created the asset',
    required: false,
    type: [NvmVersionsDto],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NvmVersionsDto)
  versions: NvmVersionsDto[];
}
